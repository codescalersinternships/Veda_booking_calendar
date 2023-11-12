import express from 'express';
import { UserController } from '../controllers/controller.user';

const _router = express.Router();

_router.post('/signup', UserController.signup);
_router.post('/signin', UserController.signin);

export const router = _router;
