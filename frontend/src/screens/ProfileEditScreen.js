import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileEditScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  const userConfirmsPassword = false;

  console.log(userInfo, 'userInfo here');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile/edit',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'FETCH_FAIL',
      });
      toast.error(getError(err));
    }
  };

  const confirmPasswordHandler = async (e) => {
    e.preventDefault();
    // send a post request to the server to see if the password is correct
    // if it is, then we have to turn userConfirmsPassword to true
    // if it is not, then userConfirmsPassword stays false
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Update Profile</title>
      </Helmet>
      {userConfirmsPassword ? (
        <>
          <h1 className='my-3'>Update Profile</h1>

          <form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Password</Form.Label>
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
          </form>
        </>
      ) : (
        <>
          <h1>Please Confirm Your Password</h1>
          <h6>Please enter your password in order to get this.</h6>
          <br />
          <>
            <Form onSubmit={confirmPasswordHandler}>
              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className='mb-3'>
                <Button type='submit'>Confirm</Button>
              </div>
            </Form>
          </>
        </>
      )}
    </div>
  );
}
