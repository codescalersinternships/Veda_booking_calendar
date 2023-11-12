import express from 'express';
import { RequestController } from '../controllers/controller.request';

const _router = express.Router();

_router.post('/', RequestController.post);
_router.get('/:requestId', RequestController.get);

export const router = _router;
