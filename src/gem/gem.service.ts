import {GemModel} from './gem.model';
import { IGem, CreateGemDto } from './gem.interface';




export async function createGemRecordInDb(gemData: CreateGemDto): Promise<IGem> {
  try {
    const existingGemByContract = await GemModel.findOne({ contractAddress: gemData.contractAddress.toLowerCase() });
    if (existingGemByContract) {
      throw new Error(`Gem with contract address ${gemData.contractAddress} already exists.`);
    }
    const existingGemByTx = await GemModel.findOne({ transactionHash: gemData.transactionHash });
    if (existingGemByTx) {
      throw new Error(`Gem with transaction hash ${gemData.transactionHash} already exists.`);
    }

    const newGem = new GemModel({
      ...gemData,
      contractAddress: gemData.contractAddress.toLowerCase(),
      creatorAddress: gemData.creatorAddress.toLowerCase(),
      symbol: gemData.symbol.toUpperCase(),
    });
    await newGem.save();
    return newGem;
  } catch (error: any) {
    console.error('Error creating gem in service:', error);
    if (error.code === 11000) {
      throw new Error('A gem with this contract address or transaction hash already exists.');
    }
    throw error;
  }
}

/**
 * Retrieves all gems created by a specific user.
 * @param creatorAddress - The wallet address of the creator.
 * @returns An array of gem documents.
 */
export async function findGemsByCreator(creatorAddress: string): Promise<IGem[]> {
  try {
    return await GemModel.find({ creatorAddress: creatorAddress.toLowerCase() }).sort({ createdAt: -1 });
  } catch (error: any) {
    console.error('Error fetching gems by creator:', error);
    throw error;
  }
}

/**
 * Retrieves a specific gem by its contract address.
 * @param contractAddress - The contract address of the gem.
 * @returns The gem document or null if not found.
 */
export async function findGemByContractAddress(contractAddress: string): Promise<IGem | null> {
  try {
    return await GemModel.findOne({ contractAddress: contractAddress.toLowerCase() });
  } catch (error: any) {
    console.error('Error fetching gem by contract address:', error);
    throw error;
  }
}

/**
 * Retrieves all gems stored in the database, optionally with pagination.
 * @param page - The page number for pagination (default: 1).
 * @param limit - The number of items per page (default: 10).
 * @returns An array of gem documents.
 */
export async function findAllGems(page: number = 1, limit: number = 10): Promise<{gems: IGem[], total: number, page: number, pages: number}> {
  try {
    const skip = (page - 1) * limit;
    const total = await GemModel.countDocuments();
    const gems = await GemModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return {
      gems,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  } catch (error: any) {
    console.error('Error fetching all gems:', error);
    throw error;
  }
}