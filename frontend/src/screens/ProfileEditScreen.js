import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
  const [confirmPasswordToSeeUserInfo, setConfirmPasswordToSeeUserInfo] =
    useState(false);
  const [disabledValue, setDisabledValue] = useState(true);
  const columnLength = 10;
  const navigate = useNavigate();

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

  const confirmPasswordToSeeUserInfoHandler = async (e) => {
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
        setConfirmPasswordToSeeUserInfo(true);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const updatEmailInput = (e) => {
    e.preventDefault();
    setDisabledValue(!disabledValue);
  };

  const redirectToEditEmail = (e) => {
    e.preventDefault();
    navigate('/settings/email');
  };

  return (
    <div className='container small-container'>
      <Helmet>
        <title>Update Profile</title>
      </Helmet>
      {confirmPasswordToSeeUserInfo ? (
        <>
          <h1 className='my-3'>Update Profile</h1>

          <form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Row>
                <Col xs={columnLength}>
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disabledValue}
                    required
                  />
                </Col>
                <Col>
                  <Button onClick={updatEmailInput}>Edit</Button>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Email</Form.Label>
              <Row>
                <Col xs={columnLength}>
                  <Form.Control
                    disabled
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Button onClick={redirectToEditEmail}>Edit</Button>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className='mb-3' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Row>
                <Col xs={columnLength}>
                  <Form.Control
                    disabled
                    type='password'
                    value='********'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
                <Col>
                  <Button>Edit</Button>
                </Col>
              </Row>
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
            <Form onSubmit={confirmPasswordToSeeUserInfoHandler}>
              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link to='/forgotpassword'>Forgot Password?</Link>
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
