import express from 'express';
import { BoatController } from '../controllers/controller.boat';

const _router = express.Router();

_router.post('/', BoatController.create);

export const router = _router;
