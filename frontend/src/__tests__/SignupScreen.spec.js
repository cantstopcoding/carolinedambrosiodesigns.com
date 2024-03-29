import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from '../Store';
import SignupScreen from '../screens/SignupScreen';
import { BrowserRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { waitFor } from '@testing-library/dom';
import { ToastContainer } from 'react-toastify';

describe('SignupScreen', () => {
  const MockSignupScreen = () => {
    return (
      <StoreProvider>
        <HelmetProvider>
          <BrowserRouter>
            <ToastContainer position='bottom-center' limit={3} />
            <SignupScreen />
          </BrowserRouter>
        </HelmetProvider>
      </StoreProvider>
    );
  };

  function setUpInputAndRender(MockSignupScreen) {
    render(<MockSignupScreen />);

    const usernameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const confirmEmailInput = screen.getByLabelText('Confirm Email');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const button = screen.getByRole('button', { name: 'Sign Up' });
    return {
      usernameInput,
      emailInput,
      confirmEmailInput,
      passwordInput,
      confirmPasswordInput,
      button,
    };
  }

  describe('Layout', () => {
    const expectInputToBeInDocument = (labelText) => {
      render(<MockSignupScreen />);
      const input = screen.getByLabelText(labelText);
      expect(input).toBeInTheDocument();
    };

    it('has a header', async () => {
      render(<MockSignupScreen />);
      screen.getByRole('heading', { name: 'Sign Up' });
    });

    it.each`
      field
      ${'Username'}
      ${'Email'}
      ${'Confirm Email'}
      ${'Password'}
      ${'Confirm Password'}
    `('has $field input', ({ field }) => {
      expectInputToBeInDocument(field);
    });

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

  describe('Interactions', () => {
    let requestBody;
    const server = setupServer(
      rest.post('/api/users/signup', (req, res, ctx) => {
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    it('sends username, email and password to backend after clicking the button', async () => {
      const {
        usernameInput,
        emailInput,
        confirmEmailInput,
        passwordInput,
        confirmPasswordInput,
        button,
      } = setUpInputAndRender(MockSignupScreen);

      userEvent.type(usernameInput, 'user1');
      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(confirmEmailInput, 'user1@mail.com');
      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(confirmPasswordInput, 'P4ssword');
      userEvent.click(button);

      await waitFor(() => {
        expect(requestBody).toEqual({
          name: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        });
      });
    });

    it('displays a Toast error from the backend', async () => {
      server.use(
        rest.post('/api/users/signup', async (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: 'Password must be at least 8 characters',
            })
          );
        })
      );

      const {
        usernameInput,
        emailInput,
        passwordInput,
        confirmEmailInput,
        confirmPasswordInput,
        button,
      } = setUpInputAndRender(MockSignupScreen);

      userEvent.type(usernameInput, 'user1');
      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(confirmEmailInput, 'user1@mail.com');
      userEvent.type(passwordInput, 'P4sswor');
      userEvent.type(confirmPasswordInput, 'P4sswor');
      userEvent.click(button);

      const toastRole = await screen.findByRole('alert');
      const validationErrorText = await screen.findByText(
        'Password must be at least 8 characters'
      );

      expect(toastRole).toBeInTheDocument();
      expect(validationErrorText).toBeInTheDocument();
    });

    it('notifies user that passwords do not match', async () => {
      const { passwordInput, confirmPasswordInput, button } =
        setUpInputAndRender(MockSignupScreen);

      userEvent.type(passwordInput, 'P4ssword');
      userEvent.type(confirmPasswordInput, 'P4sswor');
      userEvent.click(button);

      await waitFor(() => {
        const validationError = screen.getByText('Passwords do not match');
        expect(validationError).toBeInTheDocument();
      });
    });

    it('notifies user that emails do not match', async () => {
      const { emailInput, confirmEmailInput, button } =
        setUpInputAndRender(MockSignupScreen);

      userEvent.type(emailInput, 'user1@mail.com');
      userEvent.type(confirmEmailInput, 'user2@mail.com');
      userEvent.click(button);

      await waitFor(() => {
        const validationError = screen.getByText('Emails do not match');
        expect(validationError).toBeInTheDocument();
      });
    });

    it('notifies user that username is too long', async () => {
      const { usernameInput, button } = setUpInputAndRender(MockSignupScreen);

      userEvent.type(usernameInput, 'u'.repeat(51));
      userEvent.click(button);

      await waitFor(() => {
        const validationError = screen.getByText(
          'Username must be less than 50 characters'
        );
        expect(validationError).toBeInTheDocument();
      });
    });

    it('notifies user that username cannot have spaces', async () => {
      const { usernameInput, button } = setUpInputAndRender(MockSignupScreen);

      userEvent.type(usernameInput, 'user 1');
      userEvent.click(button);

      await waitFor(() => {
        const validationError = screen.getByText(
          'Username "user 1" cannot contain spaces'
        );
        expect(validationError).toBeInTheDocument();
      });
    });
  });
});
