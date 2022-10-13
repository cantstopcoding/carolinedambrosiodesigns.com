import { render, screen } from '@testing-library/react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from '../Store';
import SignupScreen from './SignupScreen';
import { BrowserRouter } from 'react-router-dom';

describe('SignupScreen', () => {
  const MockSignupScreen = () => {
    return (
      <React.StrictMode>
        <StoreProvider>
          <HelmetProvider>
            <BrowserRouter>
              <SignupScreen />
            </BrowserRouter>
          </HelmetProvider>
        </StoreProvider>
      </React.StrictMode>
    );
  };

  describe('Layout', () => {
    it('has a header', async () => {
      render(<MockSignupScreen />);
      screen.getByRole('heading', { name: 'Sign Up' });
    });

    it('has username input', () => {
      render(<MockSignupScreen />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });
  });
});
