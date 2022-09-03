import express from 'express';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import otpGenerator from 'otp-generator';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Otp from '../models/otpModel.js';
import { generateToken, isAuth, mailgun, otpEmailTemplate } from '../utils.js';

const userRouter = express.Router();

userRouter.put(
  '/profile/edit',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      sendUpdatedUser(user, res);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.put(
  '/profile/edit-password',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      await updatePasswordHandler();
    }

    async function updatePasswordHandler() {
      handleEmptyInputs();
      if (passwordIsCorrect()) {
        await updatePasswordAndSendUser();
      } else {
        sendInvalidPasswordMessage();
      }
    }

    function handleEmptyInputs() {
      if (noPasswordData())
        return res.status(400).send({ message: 'Password is required' });
      if (noNewPasswordData())
        return res.status(400).send({ message: 'New Password is required' });
    }

    function noPasswordData() {
      return !req.body.password;
    }

    function noNewPasswordData() {
      return !req.body.newPassword;
    }

    function passwordIsCorrect() {
      return bcrypt.compareSync(req.body.password, user.password);
    }

    async function updatePasswordAndSendUser() {
      user.password = bcrypt.hashSync(req.body.newPassword, 8);
      await sendUpdatedUser(user, res);
    }

    function sendInvalidPasswordMessage() {
      res.status(401).send({ message: 'Invalid Password' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const userPersistsPassword = !!req.body.password;

    if (userPersistsPassword) {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });

      const user = await newUser.save();

      const userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      };

      res.send(userInfo);
    } else {
      res.status(400).send({ message: 'Password is required' });
    }
  })
);

userRouter.post(
  '/confirm-password-to-see-user-info',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      const passwordIsCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordIsCorrect) {
        res.send({ message: 'Password is correct' });
      } else {
        res.status(401).send({ message: 'Password is incorrect' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forgot-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send({ message: 'Email not associated with an account' });
    }

    const otpCharacters = otpGenerator.generate(6);
    console.log('otpCharacters:', otpCharacters);

    const email = req.body.email;

    const otpModel = new Otp({ email: email, otp: otpCharacters });

    const salt = await bcrypt.genSalt(10);

    otpModel.otp = await bcrypt.hash(otpModel.otp, salt);

    const result = await otpModel.save();

    return res.status(200).send({ message: 'OTP sent successfully' });
  })
);

userRouter.post(
  '/email-otp',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const otpCharacters = otpGenerator.generate(6);
    console.log('otpCharacters:', otpCharacters);

    const newEmail = req.body.newEmail;

    const name = req.body.name;

    const otpModel = new Otp({ newEmail: newEmail, otp: otpCharacters });

    const salt = await bcrypt.genSalt(10);

    otpModel.otp = await bcrypt.hash(otpModel.otp, salt);

    const result = await otpModel.save();

    mailgun()
      .messages()
      .send(
        {
          from: 'Caroline <carolinemg@sandbox59d19782dd3640acace1d6efef1a3e2d.mailgun.org>',
          to: `${name} <${newEmail}>`,
          subject: `${otpCharacters} is your verification code`,
          html: otpEmailTemplate(otpCharacters),
        },
        (error, body) => {
          if (error) {
            console.log(error);
          }
          console.log(body, 'send was successful!');
        }
      );

    return res.status(200).send({ message: 'OTP sent successfully' });
  })
);

userRouter.post(
  '/forgot-password/verify-otp',
  expressAsyncHandler(async (req, res) => {
    const otpArray = await Otp.find({ email: req.body.email });
    if (otpIsExpired()) {
      return res.status(400).send({ message: 'You used an expired OTP' });
    }
    const lastOtpGenerated = otpArray[otpArray.length - 1];

    const validUser = bcrypt.compareSync(req.body.otp, lastOtpGenerated.otp);

    if (lastOtpGenerated.email === req.body.email && validUser) {
      return res.status(200).send({ message: 'OTP is correct' });
    } else {
      return res.status(400).send({ message: 'Your OTP was wrong' });
    }

    function otpIsExpired() {
      return otpArray.length === 0;
    }
  })
);

userRouter.post('/forgot-password/update-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    user.password = bcrypt.hashSync(req.body.password, 8);
    sendUpdatedUser(user, res);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userRouter.post(
  '/update-email/verify-otp',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const otpArray = await Otp.find({ newEmail: req.body.newEmail });
    if (otpIsExpired()) {
      return res.status(400).send({ message: 'You used an expired OTP' });
    }
    const lastOtpGenerated = otpArray[otpArray.length - 1];

    const validUser = bcrypt.compareSync(req.body.otp, lastOtpGenerated.otp);

    if (lastOtpGenerated.newEmail === req.body.newEmail && validUser) {
      return await updateEmail();
    } else {
      return res.status(400).send({ message: 'Your OTP was wrong' });
    }

    async function updateEmail() {
      const user = await User.findOne({ email: req.body.currentEmail });
      user.email = req.body.newEmail;
      await user.save();
      sendUpdatedUser(user, res);
    }

    function otpIsExpired() {
      return otpArray.length === 0;
    }
  })
);

export default userRouter;

async function sendUpdatedUser(user, response) {
  const updatedUser = await user.save();
  response.send({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser),
  });
}
