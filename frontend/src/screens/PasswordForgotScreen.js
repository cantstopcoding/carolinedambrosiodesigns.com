import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function PasswordForgotScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpIsSent, setOtpIsSent] = useState(false);
  const [optIsCorrect, setOptIsCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sendOtpToNewEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/forgot-password', {
        email,
      });
      setOtpIsSent(true);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/users/forgot-password/verify-otp',
        {
          email,
          otp,
        }
      );
      toast.success(data.message);
      setOptIsCorrect(true);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const updatePasswordHandler = async (e) => {};

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      {displayCertainFormHandler()}
      {updatePasswordForm()}
    </div>
  );

  function displayCertainFormHandler() {
    if (otpIsSent) return verifyOtpForm();

    return emailAddressForm();
  }

  function verifyOtpForm() {
    return (
      <form onSubmit={verifyOtpHandler}>
        <h1>We sent you a code</h1>
        <p>Enter it below to verify your email.</p>
        <Form.Group className='mb-3' controlId='otp'>
          <Form.Label>Verification Code</Form.Label>
          <Form.Control value={otp} onChange={(e) => setOtp(e.target.value)} />
        </Form.Group>
        <div className='mb-3'>
          <Button type='submit'>Proceed</Button>
        </div>
      </form>
    );
  }

  function emailAddressForm() {
    return (
      <form onSubmit={sendOtpToNewEmail}>
        <h1>Find your account</h1>
        <p>Enter the email address associated with your account.</p>
        <br />
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>New Email:</Form.Label>
          <Form.Control
            value={email}
            type='email'
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Proceed</Button>
        </div>
      </form>
    );
  }

  function updatePasswordForm() {
    return (
      <form onSubmit={updatePasswordHandler}>
        {newPasswordField()}
        {confirmPasswordField()}
        <div className='mb-3'>
          <Button type='submit'>Update</Button>
        </div>
      </form>
    );
  }

  function newPasswordField() {
    return (
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>New Password:</Form.Label>
        <Form.Control
          value={newPassword}
          type='password'
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Group>
    );
  }

  function confirmPasswordField() {
    return (
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Confirm Password:</Form.Label>
        <Form.Control
          value={confirmPassword}
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
    );
  }
}
