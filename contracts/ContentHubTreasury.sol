// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContentHubTreasury
 * @dev Tracks ContentHub payment volume while retaining creator, reward, and
 * protocol balances so dashboards can measure real managed value.
 */
contract ContentHubTreasury {
    address public constant NATIVE_TOKEN = address(0);

    bytes32 public constant ACTION_UPLOAD = keccak256("UPLOAD");
    bytes32 public constant ACTION_MINT = keccak256("MINT");
    bytes32 public constant ACTION_TIP = keccak256("TIP");
    bytes32 public constant ACTION_UNLOCK = keccak256("UNLOCK");
    bytes32 public constant ACTION_SUBSCRIPTION = keccak256("SUBSCRIPTION");

    bytes32 public constant POOL_REWARDS = keccak256("REWARDS");
    bytes32 public constant POOL_COMMUNITY = keccak256("COMMUNITY");

    uint256 public constant BPS_DENOMINATOR = 10_000;

    address public owner;
    address public pendingOwner;
    address public protocolRecipient;
    address public rewardOperator;

    uint256 public creatorBps = 7_000;
    uint256 public rewardPoolBps = 2_000;
    uint256 public communityPoolBps = 500;
    uint256 public protocolBps = 500;

    bool private locked;

    struct AssetAccounting {
        uint256 totalPaymentVolume;
        uint256 totalFundingVolume;
        uint256 creatorEscrowBalance;
        uint256 rewardPoolBalance;
        uint256 communityPoolBalance;
        uint256 protocolBalance;
        uint256 totalCreatorWithdrawn;
        uint256 totalPoolWithdrawn;
        uint256 totalProtocolWithdrawn;
    }

    mapping(address => bool) public supportedAssets;
    mapping(address => AssetAccounting) public assetAccounting;
    mapping(address => mapping(address => uint256)) public creatorBalances;

    event AssetSupportUpdated(address indexed token, bool supported);
    event FeeSplitUpdated(uint256 creatorBps, uint256 rewardPoolBps, uint256 communityPoolBps, uint256 protocolBps);
    event ProtocolRecipientUpdated(address indexed protocolRecipient);
    event RewardOperatorUpdated(address indexed rewardOperator);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed pendingOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    event PaymentRecorded(
        address indexed payer,
        address indexed creator,
        address indexed token,
        uint256 amount,
        uint256 creatorShare,
        uint256 rewardPoolShare,
        uint256 communityPoolShare,
        uint256 protocolShare,
        bytes32 action,
        uint256 referenceId
    );

    event TreasuryFunded(
        address indexed funder,
        address indexed token,
        uint256 amount,
        bytes32 indexed pool,
        uint256 referenceId
    );

    event CreatorWithdrawal(address indexed creator, address indexed token, uint256 amount);
    event PoolWithdrawal(address indexed token, bytes32 indexed pool, address indexed recipient, uint256 amount);
    event ProtocolWithdrawal(address indexed token, address indexed recipient, uint256 amount);
    event ExcessRecovered(address indexed token, address indexed recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == owner || msg.sender == rewardOperator, "Only operator");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(address _protocolRecipient) {
        require(_protocolRecipient != address(0), "Invalid protocol recipient");

        owner = msg.sender;
        protocolRecipient = _protocolRecipient;
        rewardOperator = msg.sender;
        supportedAssets[NATIVE_TOKEN] = true;

        emit AssetSupportUpdated(NATIVE_TOKEN, true);
        emit ProtocolRecipientUpdated(_protocolRecipient);
        emit RewardOperatorUpdated(msg.sender);
        emit OwnershipTransferred(address(0), msg.sender);
        emit FeeSplitUpdated(creatorBps, rewardPoolBps, communityPoolBps, protocolBps);
    }

    receive() external payable {
        require(msg.value > 0, "No value");
        _fundPool(msg.sender, NATIVE_TOKEN, msg.value, POOL_COMMUNITY, 0);
    }

    /**
     * @dev Records a native-token payment such as a tip, paid unlock, or v2 upload fee.
     */
    function recordNativePayment(
        address creator,
        bytes32 action,
        uint256 referenceId
    ) external payable nonReentrant {
        require(msg.value > 0, "No value");
        _recordPayment(msg.sender, creator, NATIVE_TOKEN, msg.value, action, referenceId);
    }

    /**
     * @dev Records an ERC-20 payment after pulling tokens from the caller.
     */
    function recordERC20Payment(
        address token,
        uint256 amount,
        address creator,
        bytes32 action,
        uint256 referenceId
    ) external nonReentrant {
        require(token != NATIVE_TOKEN, "Use native payment");
        require(amount > 0, "No amount");
        require(supportedAssets[token], "Unsupported asset");

        _safeTransferFrom(token, msg.sender, address(this), amount);
        _recordPayment(msg.sender, creator, token, amount, action, referenceId);
    }

    /**
     * @dev Funds either the creator rewards pool or the community prize pool with native tokens.
     */
    function fundNativePool(bytes32 pool, uint256 referenceId) external payable nonReentrant {
        require(msg.value > 0, "No value");
        _fundPool(msg.sender, NATIVE_TOKEN, msg.value, pool, referenceId);
    }

    /**
     * @dev Funds either the creator rewards pool or the community prize pool with ERC-20 tokens.
     */
    function fundERC20Pool(
        address token,
        uint256 amount,
        bytes32 pool,
        uint256 referenceId
    ) external nonReentrant {
        require(token != NATIVE_TOKEN, "Use native funding");
        require(amount > 0, "No amount");
        require(supportedAssets[token], "Unsupported asset");

        _safeTransferFrom(token, msg.sender, address(this), amount);
        _fundPool(msg.sender, token, amount, pool, referenceId);
    }

    function withdrawCreatorBalance(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "No amount");
        require(creatorBalances[token][msg.sender] >= amount, "Insufficient creator balance");

        creatorBalances[token][msg.sender] -= amount;

        AssetAccounting storage accounting = assetAccounting[token];
        accounting.creatorEscrowBalance -= amount;
        accounting.totalCreatorWithdrawn += amount;

        _transferAsset(token, msg.sender, amount);
        emit CreatorWithdrawal(msg.sender, token, amount);
    }

    function withdrawProtocolBalance(address token, uint256 amount) external nonReentrant {
        require(msg.sender == owner || msg.sender == protocolRecipient, "Only protocol");
        require(amount > 0, "No amount");

        AssetAccounting storage accounting = assetAccounting[token];
        require(accounting.protocolBalance >= amount, "Insufficient protocol balance");

        accounting.protocolBalance -= amount;
        accounting.totalProtocolWithdrawn += amount;

        _transferAsset(token, protocolRecipient, amount);
        emit ProtocolWithdrawal(token, protocolRecipient, amount);
    }

    function withdrawPool(
        address token,
        bytes32 pool,
        address recipient,
        uint256 amount
    ) external onlyOperator nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "No amount");
        _debitPool(token, pool, amount);

        _transferAsset(token, recipient, amount);
        emit PoolWithdrawal(token, pool, recipient, amount);
    }

    function distributePool(
        address token,
        bytes32 pool,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOperator nonReentrant {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length > 0, "No recipients");

        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            totalAmount += amounts[i];
        }

        require(totalAmount > 0, "No amount");
        _debitPool(token, pool, totalAmount);

        for (uint256 i = 0; i < recipients.length; i++) {
            if (amounts[i] == 0) continue;
            _transferAsset(token, recipients[i], amounts[i]);
            emit PoolWithdrawal(token, pool, recipients[i], amounts[i]);
        }
    }

    function setAssetSupported(address token, bool supported) external onlyOwner {
        supportedAssets[token] = supported;
        emit AssetSupportUpdated(token, supported);
    }

    function setFeeSplit(
        uint256 _creatorBps,
        uint256 _rewardPoolBps,
        uint256 _communityPoolBps,
        uint256 _protocolBps
    ) external onlyOwner {
        require(
            _creatorBps + _rewardPoolBps + _communityPoolBps + _protocolBps == BPS_DENOMINATOR,
            "Split must equal 100%"
        );

        creatorBps = _creatorBps;
        rewardPoolBps = _rewardPoolBps;
        communityPoolBps = _communityPoolBps;
        protocolBps = _protocolBps;

        emit FeeSplitUpdated(_creatorBps, _rewardPoolBps, _communityPoolBps, _protocolBps);
    }

    function setProtocolRecipient(address _protocolRecipient) external onlyOwner {
        require(_protocolRecipient != address(0), "Invalid protocol recipient");
        protocolRecipient = _protocolRecipient;
        emit ProtocolRecipientUpdated(_protocolRecipient);
    }

    function setRewardOperator(address _rewardOperator) external onlyOwner {
        require(_rewardOperator != address(0), "Invalid operator");
        rewardOperator = _rewardOperator;
        emit RewardOperatorUpdated(_rewardOperator);
    }

    function startOwnershipTransfer(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "Not pending owner");

        address previousOwner = owner;
        owner = msg.sender;
        pendingOwner = address(0);

        emit OwnershipTransferred(previousOwner, msg.sender);
    }

    function getManagedBalance(address token) public view returns (uint256) {
        AssetAccounting memory accounting = assetAccounting[token];
        return accounting.creatorEscrowBalance
            + accounting.rewardPoolBalance
            + accounting.communityPoolBalance
            + accounting.protocolBalance;
    }

    /**
     * @dev Protocol TVL excludes the owner's protocol revenue bucket.
     */
    function getProtocolTVL(address token) external view returns (uint256) {
        AssetAccounting memory accounting = assetAccounting[token];
        return accounting.creatorEscrowBalance + accounting.rewardPoolBalance + accounting.communityPoolBalance;
    }

    function getActualBalance(address token) public view returns (uint256) {
        if (token == NATIVE_TOKEN) return address(this).balance;
        return _balanceOf(token, address(this));
    }

    function recoverExcess(address token, address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "No amount");

        uint256 actualBalance = getActualBalance(token);
        uint256 managedBalance = getManagedBalance(token);
        require(actualBalance > managedBalance, "No excess");
        require(amount <= actualBalance - managedBalance, "Amount exceeds excess");

        _transferAsset(token, recipient, amount);
        emit ExcessRecovered(token, recipient, amount);
    }

    function _recordPayment(
        address payer,
        address creator,
        address token,
        uint256 amount,
        bytes32 action,
        uint256 referenceId
    ) internal {
        require(creator != address(0), "Invalid creator");
        require(supportedAssets[token], "Unsupported asset");

        uint256 creatorShare = (amount * creatorBps) / BPS_DENOMINATOR;
        uint256 rewardShare = (amount * rewardPoolBps) / BPS_DENOMINATOR;
        uint256 communityShare = (amount * communityPoolBps) / BPS_DENOMINATOR;
        uint256 protocolShare = amount - creatorShare - rewardShare - communityShare;

        AssetAccounting storage accounting = assetAccounting[token];
        accounting.totalPaymentVolume += amount;
        accounting.creatorEscrowBalance += creatorShare;
        accounting.rewardPoolBalance += rewardShare;
        accounting.communityPoolBalance += communityShare;
        accounting.protocolBalance += protocolShare;

        creatorBalances[token][creator] += creatorShare;

        emit PaymentRecorded(
            payer,
            creator,
            token,
            amount,
            creatorShare,
            rewardShare,
            communityShare,
            protocolShare,
            action,
            referenceId
        );
    }

    function _fundPool(
        address funder,
        address token,
        uint256 amount,
        bytes32 pool,
        uint256 referenceId
    ) internal {
        require(supportedAssets[token], "Unsupported asset");

        AssetAccounting storage accounting = assetAccounting[token];
        accounting.totalFundingVolume += amount;

        if (pool == POOL_REWARDS) {
            accounting.rewardPoolBalance += amount;
        } else if (pool == POOL_COMMUNITY) {
            accounting.communityPoolBalance += amount;
        } else {
            revert("Invalid pool");
        }

        emit TreasuryFunded(funder, token, amount, pool, referenceId);
    }

    function _debitPool(address token, bytes32 pool, uint256 amount) internal {
        AssetAccounting storage accounting = assetAccounting[token];

        if (pool == POOL_REWARDS) {
            require(accounting.rewardPoolBalance >= amount, "Insufficient reward pool");
            accounting.rewardPoolBalance -= amount;
        } else if (pool == POOL_COMMUNITY) {
            require(accounting.communityPoolBalance >= amount, "Insufficient community pool");
            accounting.communityPoolBalance -= amount;
        } else {
            revert("Invalid pool");
        }

        accounting.totalPoolWithdrawn += amount;
    }

    function _transferAsset(address token, address recipient, uint256 amount) internal {
        if (token == NATIVE_TOKEN) {
            (bool success, ) = recipient.call{value: amount}("");
            require(success, "Native transfer failed");
        } else {
            _safeTransfer(token, recipient, amount);
        }
    }

    function _safeTransfer(address token, address to, uint256 amount) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(IERC20.transfer.selector, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
    }

    function _safeTransferFrom(address token, address from, address to, uint256 amount) internal {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transferFrom.selector, from, to, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transferFrom failed");
    }

    function _balanceOf(address token, address account) internal view returns (uint256) {
        (bool success, bytes memory data) = token.staticcall(abi.encodeWithSelector(IERC20.balanceOf.selector, account));
        require(success && data.length >= 32, "Token balance failed");
        return abi.decode(data, (uint256));
    }
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
