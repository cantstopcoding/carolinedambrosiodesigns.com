import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1 className='my-3'>Contact Me</h1>
      <Form.Group className='mb-3' controlId='name'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='name'
          required
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='email'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type='email'
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className='mb-3' controlId='message'>
        <Form.Label>Message</Form.Label>
        <Form.Control
          as='textarea'
          type='message'
          rows={10}
          required
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Group>
      <div className='mb-3'>
        <Button type='submit'>Send Message</Button>
      </div>
    </Container>
  );
}
