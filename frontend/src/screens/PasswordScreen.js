import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function PasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Change your password</title>
      </Helmet>

      <h1 className='my-3'>Change your password</h1>

      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Group>

      <div className='mb-3'>
        <Button type='submit'>Update</Button>
      </div>
    </div>
  );
}
