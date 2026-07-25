import { Router } from 'express';
import { analyze } from '../controllers/analyzeController.js';
import asyncWrapper from '../utils/asyncWrapper.js';

const router = Router();

router.post('/', asyncWrapper(analyze));

export default router;
