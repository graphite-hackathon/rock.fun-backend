import { Document } from 'mongoose';

export interface IGem extends Document {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  creatorAddress: string;
  networkChainId: string;
  transactionHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateGemDto {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  creatorAddress: string;
  networkChainId: string;
  transactionHash: string;
}