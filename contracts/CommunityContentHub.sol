// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CommunityContentHub
 * @dev Cross-chain community content platform for Base and Celo
 * Deployed on Celo: 0x0bac169738f89689F8932A3E2663F1874D7CB92d
 * Users upload content by paying a small fee (0.00002 ETH on Base, 0.4 CELO on Celo)
 */
contract CommunityContentHub {
    // Upload fee: 0.00002 ETH on Base, 0.4 CELO on Celo
    uint256 public constant UPLOAD_FEE = 20000000000000; // 0.00002 in wei for Base

    address public owner;
    uint256 public totalUploads;
    uint256 public totalFeesCollected;

    struct Content {
        uint256 id;
        address uploader;
        string contentHash; // IPFS hash
        string contentType; // "image", "video", "score", "achievement"
        string metadata; // JSON metadata
        uint256 timestamp;
        uint256 votes;
        bool exists;
    }

    struct UserProfile {
        uint256 totalUploads;
        uint256 totalVotes;
        uint256 rewardsEarned;
        bool isActive;
    }

    // Mappings
    mapping(uint256 => Content) public contents;
    mapping(address => UserProfile) public users;
    mapping(address => uint256[]) public userContents;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // Events
    event ContentUploaded(
        uint256 indexed contentId,
        address indexed uploader,
        string contentHash,
        string contentType,
        uint256 timestamp
    );

    event ContentVoted(
        uint256 indexed contentId,
        address indexed voter,
        uint256 newVoteCount
    );

    event RewardDistributed(
        address indexed recipient,
        uint256 amount
    );

    event FeesWithdrawn(
        address indexed owner,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Upload content to the platform
     * @param _contentHash IPFS hash of the content
     * @param _contentType Type of content (image, video, score, etc.)
     * @param _metadata JSON metadata string
     */
    function uploadContent(
        string memory _contentHash,
        string memory _contentType,
        string memory _metadata
    ) external payable {
        require(msg.value == UPLOAD_FEE, "Incorrect upload fee");
        require(bytes(_contentHash).length > 0, "Content hash required");
        require(bytes(_contentType).length > 0, "Content type required");

        // Send fee directly to owner (creator wallet)
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Fee transfer failed");

        totalUploads++;
        totalFeesCollected += msg.value;

        contents[totalUploads] = Content({
            id: totalUploads,
            uploader: msg.sender,
            contentHash: _contentHash,
            contentType: _contentType,
            metadata: _metadata,
            timestamp: block.timestamp,
            votes: 0,
            exists: true
        });

        userContents[msg.sender].push(totalUploads);

        if (!users[msg.sender].isActive) {
            users[msg.sender].isActive = true;
        }
        users[msg.sender].totalUploads++;

        emit ContentUploaded(
            totalUploads,
            msg.sender,
            _contentHash,
            _contentType,
            block.timestamp
        );
    }

    /**
     * @dev Vote on content (costs gas only)
     * @param _contentId ID of the content to vote on
     */
    function voteContent(uint256 _contentId) external {
        require(contents[_contentId].exists, "Content does not exist");
        require(!hasVoted[_contentId][msg.sender], "Already voted");
        require(contents[_contentId].uploader != msg.sender, "Cannot vote own content");

        contents[_contentId].votes++;
        hasVoted[_contentId][msg.sender] = true;

        address uploader = contents[_contentId].uploader;
        users[uploader].totalVotes++;

        emit ContentVoted(_contentId, msg.sender, contents[_contentId].votes);
    }

    /**
     * @dev Get all content IDs uploaded by a user
     * @param _user Address of the user
     */
    function getUserContents(address _user) external view returns (uint256[] memory) {
        return userContents[_user];
    }

    /**
     * @dev Get content details
     * @param _contentId ID of the content
     */
    function getContent(uint256 _contentId) external view returns (
        uint256 id,
        address uploader,
        string memory contentHash,
        string memory contentType,
        string memory metadata,
        uint256 timestamp,
        uint256 votes
    ) {
        require(contents[_contentId].exists, "Content does not exist");
        Content memory content = contents[_contentId];
        return (
            content.id,
            content.uploader,
            content.contentHash,
            content.contentType,
            content.metadata,
            content.timestamp,
            content.votes
        );
    }

    /**
     * @dev Get latest content IDs
     * @param _count Number of recent contents to return
     */
    function getLatestContents(uint256 _count) external view returns (uint256[] memory) {
        uint256 count = _count > totalUploads ? totalUploads : _count;
        uint256[] memory latestIds = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            latestIds[i] = totalUploads - i;
        }

        return latestIds;
    }

    /**
     * @dev Get user profile
     * @param _user Address of the user
     */
    function getUserProfile(address _user) external view returns (
        uint256 totalUserUploads,
        uint256 totalUserVotes,
        uint256 rewardsEarned,
        bool isActive
    ) {
        UserProfile memory profile = users[_user];
        return (
            profile.totalUploads,
            profile.totalVotes,
            profile.rewardsEarned,
            profile.isActive
        );
    }

    /**
     * @dev Distribute rewards to top content creators
     * @param _recipients Array of recipient addresses
     * @param _amounts Array of reward amounts
     */
    function distributeRewards(
        address[] memory _recipients,
        uint256[] memory _amounts
    ) external onlyOwner {
        require(_recipients.length == _amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_amounts[i] <= address(this).balance, "Insufficient balance");

            users[_recipients[i]].rewardsEarned += _amounts[i];

            (bool success, ) = _recipients[i].call{value: _amounts[i]}("");
            require(success, "Transfer failed");

            emit RewardDistributed(_recipients[i], _amounts[i]);
        }
    }

    /**
     * @dev Withdraw collected fees (owner only)
     * @param _amount Amount to withdraw
     */
    function withdrawFees(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");

        (bool success, ) = owner.call{value: _amount}("");
        require(success, "Withdrawal failed");

        emit FeesWithdrawn(owner, _amount);
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Transfer ownership
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }

    /**
     * @dev Get platform stats
     */
    function getPlatformStats() external view returns (
        uint256 uploads,
        uint256 feesCollected,
        uint256 balance
    ) {
        return (totalUploads, totalFeesCollected, address(this).balance);
    }
}
