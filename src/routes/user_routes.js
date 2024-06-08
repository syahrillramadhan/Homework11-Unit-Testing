import express from 'express';
import { UserController } from '../controllers/user_controllers.js';
import { authentication } from '../middlewares/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);
userRoutes.post('/login', UserController.loginUser);
userRoutes.put('/edit/user', authentication, UserController.updateUser);
userRoutes.delete('/delete', authentication, UserController.deleteUser);

export {
    userRoutes
}