import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

export default function PasswordForgotScreen() {
  const [email, setEmail] = useState('');

  const sendOtpToNewEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/forgot-password', {
        email,
      });
    } catch (err) {}
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

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
    </div>
  );
}
