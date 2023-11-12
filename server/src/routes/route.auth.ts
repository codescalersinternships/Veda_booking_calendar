import express from 'express';
import { UserController } from '../controllers/controller.auth';

const _router = express.Router();

_router.post('/signup', UserController.signup);
_router.post('/signin', UserController.signin);

export const router = _router;
