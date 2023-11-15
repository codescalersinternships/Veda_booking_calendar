import express from 'express';
import { RequestController } from '../controllers/controller.request';

const _router = express.Router();

_router.post('/', RequestController.post);
_router.get('/', RequestController.all);
_router.get('/:requestId', RequestController.get);
_router.put('/:requestId', RequestController.put);

export const router = _router;
