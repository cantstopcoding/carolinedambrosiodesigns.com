import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FaTiktok } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      const { data } = axios.post('/api/users/contact', {
        name,
        email,
        subject,
        message,
      });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      toast.success('Message sent successfully, we will get back to you soon');
    } catch (err) {
      toast.error('Error sending message, please try again later');
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <Row>
        <Col md={5}></Col>
        <Col>
          <h1 className='my-3'>Contact</h1>
        </Col>
      </Row>
      <br />
      <br />
      <Row>
        <Col md={6} xs={0}>
          <h4>Send Me a Message:</h4>
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='subject'>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                required
                type='text'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='message'>
              <Form.Label>Message</Form.Label>
              <Form.Control
                as='textarea'
                value={message}
                rows={10}
                required
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <div className='mb-3'>
              <Button type='submit'>Send Message</Button>
            </div>
          </Form>
        </Col>
        <Col md={1}></Col>
        <Col md={5} xs={7}>
          <h4>Email:</h4>
          <h5>carolinedambrosiodesigns@gmail.com</h5>
          <br />
          <h4>Follow Me:</h4>
          <a
            target='_blank'
            title='TikTok'
            rel='noopener noreferrer'
            href={'https://www.tiktok.com/@regencyreticules'}
          >
            <FaTiktok size='5em' color='#73b1c8' />{' '}
          </a>
          <a
            target='_blank'
            title='YouTube'
            rel='noopener noreferrer'
            href={'https://www.youtube.com/channel/UC2nn-Kivbx0YGcQoke8lp2A'}
          >
            <BsYoutube size='5em' color='#73b1c8' />
          </a>
        </Col>
      </Row>
    </Container>
  );
}
