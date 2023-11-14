import express from 'express';
import { BoatController } from '../controllers/controller.boat';

const _router = express.Router();

_router.post('/', BoatController.post);
_router.get('/', BoatController.all);
_router.get('/:boatId', BoatController.get);

export const router = _router;
