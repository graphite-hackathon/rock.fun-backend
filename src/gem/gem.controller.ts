import { Request, Response, NextFunction } from 'express';
import {
  createGemRecordInDb,
  findGemsByCreator,
  findGemByContractAddress,
  findAllGems,
} from './gem.service';

import { CreateGemDto } from './gem.interface';

// Route Handlers (Standalone Functions)
export async function handleCreateGemRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const gemData: CreateGemDto = req.body;
    if (!gemData.contractAddress || !gemData.name || !gemData.symbol ||
        gemData.decimals === undefined || !gemData.totalSupply ||
        !gemData.creatorAddress || !gemData.networkChainId || !gemData.transactionHash) {
      res.status(400).json({ message: 'Missing required fields for gem creation.' });
      return;
    }
    const newGem = await createGemRecordInDb(gemData);
    res.status(201).json({ message: 'Gem record created successfully', data: newGem });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      res.status(409).json({ message: error.message });
    } else {
      console.error('Error in handleCreateGemRecord:', error);
      res.status(500).json({ message: 'Internal server error while creating gem record.' });
    }
    // next(error); 
  }
}

export async function handleGetGemsByCreator(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const creatorAddress = req.params.creatorAddress;
    if (!creatorAddress) {
      res.status(400).json({ message: 'Creator address parameter is required.' });
      return;
    }
    const gems = await findGemsByCreator(creatorAddress);
    if (gems.length === 0) {
      res.status(404).json({ message: 'No gems found for this creator.', data: [] });
      return;
    }
    res.status(200).json({ message: 'Gems retrieved successfully', data: gems });
  } catch (error: any) {
    console.error('Error in handleGetGemsByCreator:', error);
    res.status(500).json({ message: 'Internal server error.' });
    // next(error);
  }
}

export async function handleGetGemByContract(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contractAddress = req.params.contractAddress;
    if (!contractAddress) {
      res.status(400).json({ message: 'Contract address parameter is required.' });
      return;
    }
    const gem = await findGemByContractAddress(contractAddress);
    if (!gem) {
      res.status(404).json({ message: 'Gem not found with this contract address.' });
      return;
    }
    res.status(200).json({ message: 'Gem retrieved successfully', data: gem });
  } catch (error: any) {
    console.error('Error in handleGetGemByContract:', error);
    res.status(500).json({ message: 'Internal server error.' });
    // next(error);
  }
}

export async function handleGetAllGems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await findAllGems(page, limit);
    res.status(200).json({ message: 'All gems retrieved successfully', data: result });
  } catch (error: any) {
    console.error('Error in handleGetAllGems:', error);
    res.status(500).json({ message: 'Internal server error.' });
    // next(error);
  }
}

