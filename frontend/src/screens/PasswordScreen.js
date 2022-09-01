import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function PasswordScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [dispatch] = useReducer();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (passwordIsNotConfirmed()) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.put(
        '/api/users/profile/edit-password',
        {
          password,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Password updated successfully');
    } catch (err) {
      // dispatch({
      //   type: 'FETCH_FAIL',
      // });
      toast.error(getError(err));
    }

    function passwordIsNotConfirmed() {
      return password !== confirmPassword;
    }
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Change your password</title>
      </Helmet>

      <h1 className='my-3'>Change your password</h1>

      {updatePasswordForm()}
    </div>
  );

  function updatePasswordForm() {
    return (
      <form onSubmit={submitHandler}>
        {currentPasswordField()}
        {newPasswordField()}
        {confirmPasswordField()}

        <div className='mb-3'>
          <Button type='submit'>Update</Button>
        </div>
      </form>
    );
  }

  function currentPasswordField() {
    return (
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
    );
  }

  function newPasswordField() {
    return (
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Group>
    );
  }

  function confirmPasswordField() {
    return (
      <Form.Group className='mb-3' controlId='password'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type='password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
    );
  }
}
