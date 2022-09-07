import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function EmailVerifyScreen() {
  const [otp, setOtp] = useState('');

  const verifyOtpHandler = async (e) => {};

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
}
