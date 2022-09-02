import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function UpdateEmailScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const currentEmail = userInfo.email;
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPasswordToProceed, setConfirmPasswordToProceed] =
    useState(false);
  const [otpIsSent, setOtpIsSent] = useState(false);
  const [otp, setOtp] = useState('');

  const confirmPasswordToProceedHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/users/confirm-password-to-see-user-info',
        {
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (data.message === 'Password is correct') {
        setConfirmPasswordToProceed(true);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const sendOtpToNewEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        '/api/users/email-otp',
        {
          newEmail,
          otp,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
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
        '/api/users//update-email/verify-otp',
        {
          currentEmail,
          newEmail,
          otp,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));

      toast.success('Email updated successfully');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Change your email</title>
      </Helmet>
      {displayCertainFormHandler()}
    </div>
  );

  function displayCertainFormHandler() {
    if (confirmPasswordToProceed && otpIsSent) return verifyOtpForm();
    if (confirmPasswordToProceed) return newEmailAddressForm();
    return confirmPasswordForm();
  }

  function newEmailAddressForm() {
    return (
      <form onSubmit={sendOtpToNewEmail}>
        <Form.Group className='mb-3' controlId='newEmail'>
          <Form.Label>New Email</Form.Label>
          <Form.Control
            value={newEmail}
            type='email'
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Proceed</Button>
        </div>
      </form>
    );
  }

  function confirmPasswordForm() {
    return (
      <form onSubmit={confirmPasswordToProceedHandler}>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Proceed</Button>
        </div>
      </form>
    );
  }

  function verifyOtpForm() {
    return (
      <form onSubmit={verifyOtpHandler}>
        <Form.Group className='mb-3' controlId='otp'>
          <Form.Label>Confirm OTP</Form.Label>
          <Form.Control value={otp} onChange={(e) => setOtp(e.target.value)} />
        </Form.Group>

        <div className='mb-3'>
          <Button type='submit'>Proceed</Button>
        </div>
      </form>
    );
  }
}
