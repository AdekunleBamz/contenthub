// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContentNFT
 * @dev NFT contract for minting achievement badges and content NFTs
 * Deployed on Celo: 0x11E07A42989212622306A0F293829888fe004828
 * Minting fee: 0.00002 ETH on Base, 0.4 CELO on Celo
 */
contract ContentNFT {
    uint256 public constant MINT_FEE = 20000000000000; // 0.00002 in wei for Base

    address public owner;
    uint256 public nextTokenId;
    uint256 public totalMinted;

    struct NFTMetadata {
        uint256 tokenId;
        address minter;
        string metadataURI;
        string nftType; // "achievement", "content", "badge", "milestone"
        uint256 timestamp;
        bool exists;
    }

    // Mappings
    mapping(uint256 => address) public tokenOwner;
    mapping(address => uint256) public ownerTokenCount;
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public ownerTokens;

    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string metadataURI,
        string nftType,
        uint256 timestamp
    );

    event NFTTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        nextTokenId = 1;
    }

    /**
     * @dev Mint a new NFT
     * @param _metadataURI IPFS URI for NFT metadata
     * @param _nftType Type of NFT
     */
    function mintNFT(
        string memory _metadataURI,
        string memory _nftType
    ) external payable returns (uint256) {
        require(msg.value == MINT_FEE, "Incorrect mint fee");
        require(bytes(_metadataURI).length > 0, "Metadata URI required");

        // Send fee directly to owner (creator wallet)
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Fee transfer failed");

        uint256 tokenId = nextTokenId;
        nextTokenId++;
        totalMinted++;

        tokenOwner[tokenId] = msg.sender;
        ownerTokenCount[msg.sender]++;
        ownerTokens[msg.sender].push(tokenId);

        nftMetadata[tokenId] = NFTMetadata({
            tokenId: tokenId,
            minter: msg.sender,
            metadataURI: _metadataURI,
            nftType: _nftType,
            timestamp: block.timestamp,
            exists: true
        });

        emit NFTMinted(tokenId, msg.sender, _metadataURI, _nftType, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Transfer NFT to another address
     * @param _to Recipient address
     * @param _tokenId Token ID to transfer
     */
    function transferNFT(address _to, uint256 _tokenId) external {
        require(tokenOwner[_tokenId] == msg.sender, "Not token owner");
        require(_to != address(0), "Invalid recipient");
        require(nftMetadata[_tokenId].exists, "Token does not exist");

        // Remove from current owner
        ownerTokenCount[msg.sender]--;

        // Add to new owner
        tokenOwner[_tokenId] = _to;
        ownerTokenCount[_to]++;
        ownerTokens[_to].push(_tokenId);

        emit NFTTransferred(_tokenId, msg.sender, _to);
    }

    /**
     * @dev Get NFT metadata
     */
    function getNFTMetadata(uint256 _tokenId) external view returns (
        uint256 tokenId,
        address minter,
        address currentOwner,
        string memory metadataURI,
        string memory nftType,
        uint256 timestamp
    ) {
        require(nftMetadata[_tokenId].exists, "Token does not exist");
        NFTMetadata memory nft = nftMetadata[_tokenId];
        return (
            nft.tokenId,
            nft.minter,
            tokenOwner[_tokenId],
            nft.metadataURI,
            nft.nftType,
            nft.timestamp
        );
    }

    /**
     * @dev Get all tokens owned by an address
     */
    function getOwnerTokens(address _owner) external view returns (uint256[] memory) {
        return ownerTokens[_owner];
    }

    /**
     * @dev Withdraw collected fees
     */
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        (bool success, ) = owner.call{value: _amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
