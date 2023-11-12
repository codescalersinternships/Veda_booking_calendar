import express from 'express';
import { RequestController } from '../controllers/controller.request';

const _router = express.Router();

_router.post('/', RequestController.request);

export const router = _router;
