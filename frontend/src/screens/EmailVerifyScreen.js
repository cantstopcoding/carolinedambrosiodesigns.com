import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function EmailVerifyScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [otp, setOtp] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/signup', {
        otp,
      });
      signUserInWith(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className='container small-container'>
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
    </div>
  );

  function signUserInWith(data) {
    ctxDispatch({ type: 'USER_SIGNIN', payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    navigate(redirect || '/');
  }
}
