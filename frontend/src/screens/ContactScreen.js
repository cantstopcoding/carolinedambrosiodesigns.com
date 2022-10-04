import React from 'react';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FaTiktok } from 'react-icons/fa';
import { BsYoutube } from 'react-icons/bs';

export default function ContactScreen() {
  return (
    <Container className='contact-screen-container'>
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <h1>Contact</h1>
      <br />
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
    </Container>
  );
}
