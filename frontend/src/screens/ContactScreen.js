import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FaTiktok } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';

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
      <br />
      <br />
      <h1>Social Media</h1>
      <br />
      <h3>Follow Me:</h3>
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
    </Container>
  );
}
