import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from '../Store';
import SignupScreen from '../screens/SignupScreen';
import { BrowserRouter } from 'react-router-dom';

describe('SignupScreen', () => {
  const MockSignupScreen = () => {
    return (
      <StoreProvider>
        <HelmetProvider>
          <BrowserRouter>
            <SignupScreen />
          </BrowserRouter>
        </HelmetProvider>
      </StoreProvider>
    );
  };

  describe('Layout', () => {
    it('has a header', async () => {
      render(<MockSignupScreen />);
      screen.getByRole('heading', { name: 'Sign Up' });
    });

    it('has username input', () => {
      expectInputToBeInDocument('Username');
    });

    it('has email input', () => {
      expectInputToBeInDocument('Email');
    });

    it('has confirm email input', () => {
      expectInputToBeInDocument('Confirm Email');
    });

    it('has password input', () => {
      expectInputToBeInDocument('Password');
    });

    it('has confirm password input', () => {
      expectInputToBeInDocument('Confirm Password');
    });

    function expectInputToBeInDocument(labelText) {
      render(<MockSignupScreen />);
      const input = screen.getByLabelText(labelText);
      expect(input).toBeInTheDocument();
    }

    it('has sign up button', () => {
      render(<MockSignupScreen />);
      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    });

    it('has "Already have an account?" question', () => {
      render(<MockSignupScreen />);
      const question = screen.getByText('Already have an account?');
      expect(question).toBeInTheDocument();
    });

    it('has a link to signin page', () => {
      render(<MockSignupScreen />);
      const link = screen.getByRole('link', { name: 'Sign In' });
      expect(link).toBeInTheDocument();
    });
  });
});
