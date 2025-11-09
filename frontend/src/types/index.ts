export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
}

export interface Property {
  id: number;
  propertyUid: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  title: string;
  address: string;
  area: number;
  gisCoordinates?: string;
  status: 'REGISTERED' | 'FOR_SALE' | 'PENDING_TRANSFER' | 'TRANSFERRED';
  createdAt: string;
}

export interface Transaction {
  id: number;
  propertyId: number;
  propertyUid: string;
  propertyTitle: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  amount: number;
  status: 'INITIATED' | 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  approvedById?: number;
  approvedByName?: string;
  createdAt: string;
}

export interface Block {
  id: number;
  blockIndex: number;
  timestamp: string;
  transactionId: number;
  dataHash: string;
  previousHash: string;
  currentHash: string;
  nonce: number;
  transaction?: Transaction;
}

export interface Document {
  id: number;
  propertyId: number;
  fileName: string;
  filePath: string;
  fileChecksum: string;
  uploadedById: number;
  uploadedByName: string;
  uploadedAt: string;
}

export interface ChainVerificationResponse {
  isValid: boolean;
  message: string;
  tamperedBlocks: TamperedBlockInfo[];
}

export interface TamperedBlockInfo {
  blockIndex: number;
  issue: string;
  expectedHash: string;
  actualHash: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  fullName: string;
  email: string;
  createdAt: string;
}

