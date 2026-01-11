/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  limit: number;
  offset: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  nextOffset: number | null;
  prevOffset: number | null;
}

/**
 * Authentication Types
 */
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthData {
  username: string;
  walletAddress: string;
}

export type RegisterResponse = ApiResponse<AuthData>;
export type LoginResponse = ApiResponse<AuthData>;
export type LogoutResponse = ApiResponse<null>;

/**
 * Transaction Types
 */
export interface CreateTransactionRequest {
  recipientAddress: string;
  amount: number;
}

export interface Transaction {
  _id: string;
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  status: "pending" | "confirmed";
  blockIndex?: number;
  block?: string | Block;
  timestamp: number;
  type?: "sent" | "received"; // Only in history endpoint
}

export interface WalletData {
  balance: number;
  walletAddress: string;
}

export interface TransactionSummary {
  walletAddress: string;
  availableBalance: number;
  pendingBalance: number;
  pendingTransactionCount: number;
  totalTransactionCount: number;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  pagination: PaginationMeta;
}

export type CreateTransactionResponse = ApiResponse<null>;
export type GetWalletResponse = ApiResponse<WalletData>;
export type GetPendingBalanceResponse = ApiResponse<WalletData>;
export type GetTransactionsByStatusResponse = ApiResponse<Transaction[]>;
export type GetTransactionHistoryResponse = ApiResponse<TransactionHistoryResponse>;
export type GetTransactionSummaryResponse = ApiResponse<TransactionSummary>;

/**
 * Blockchain Types
 */
export interface BlockTransaction {
  _id: string;
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  blockIndex: number;
  block: string;
  timestamp: number;
}

export interface Block {
  _id: string;
  index: number;
  previousHash: string;
  nonce: number;
  hash: string;
  transactions: BlockTransaction[] | string[];
  timestamp: number;
  createdAt: string;
}

export interface BlockchainResponse {
  blocks: Block[];
  pagination: PaginationMeta;
}

export type MineBlockResponse = ApiResponse<Block>;
export type GetChainResponse = ApiResponse<BlockchainResponse>;

/**
 * Root API Types
 */
export interface AppInfo {
  appName: string;
  appVersion: string;
  appEnveronment: string;
}

export type GetRootResponse = ApiResponse<AppInfo>;
