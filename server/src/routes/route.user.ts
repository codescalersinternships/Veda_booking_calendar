import express from 'express';
import { UserController } from '../controllers/controller.user';

const _router = express.Router();

_router.get('/me', UserController.me);

export const router = _router;
