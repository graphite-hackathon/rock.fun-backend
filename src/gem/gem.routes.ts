import { Router } from "express";
import { handleCreateGemRecord, handleGetAllGems, handleGetGemByContract, handleGetGemsByCreator } from "./gem.controller";



export function createGemRouter(): Router {
  const router = Router();
  router.post('/gems/create', handleCreateGemRecord);
  router.get('/gems/creator/:creatorAddress', handleGetGemsByCreator);
  router.get('/gems/contract/:contractAddress', handleGetGemByContract);
  router.get('/gems', handleGetAllGems);
  return router;
}