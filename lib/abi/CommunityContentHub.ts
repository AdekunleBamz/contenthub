export const COMMUNITY_CONTENT_HUB_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "contentId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "uploader", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "contentHash", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "contentType", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "ContentUploaded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "contentId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "newVoteCount", "type": "uint256"}
    ],
    "name": "ContentVoted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "UPLOAD_FEE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_contentHash", "type": "string"},
      {"internalType": "string", "name": "_contentType", "type": "string"},
      {"internalType": "string", "name": "_metadata", "type": "string"}
    ],
    "name": "uploadContent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_contentId", "type": "uint256"}],
    "name": "voteContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserContents",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_contentId", "type": "uint256"}],
    "name": "getContent",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "uploader", "type": "address"},
      {"internalType": "string", "name": "contentHash", "type": "string"},
      {"internalType": "string", "name": "contentType", "type": "string"},
      {"internalType": "string", "name": "metadata", "type": "string"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "votes", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_count", "type": "uint256"}],
    "name": "getLatestContents",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalUploads",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPlatformStats",
    "outputs": [
      {"internalType": "uint256", "name": "uploads", "type": "uint256"},
      {"internalType": "uint256", "name": "feesCollected", "type": "uint256"},
      {"internalType": "uint256", "name": "balance", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
