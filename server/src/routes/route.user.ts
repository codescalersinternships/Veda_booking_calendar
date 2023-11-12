//importing modules
import express from 'express';
import { signup, login } from '../controllers/controller.user';

const _router = express.Router();

//signup endpoint
//passing the middleware function to the signup
_router.post('/signup', signup);

//login route
// _router.post('/login', login);

export const router = _router;
