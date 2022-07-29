import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken, isAuth, isAdmin } from '../utils.js';

const adminRouter = express.Router();

adminRouter.get(
  '/users',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    console.log('got it!');
    const users = await User.find({});
    res.send(users);
  })
);

export default adminRouter;
