import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSignupMutation } from '../appApi';
import emailjs from 'emailjs-com';

const SignupContainer = styled(Container)`
  @media screen and (max-width: 756px) {
    .signup__image--container {
      display: none;
    }
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* Align items to the center */
  justify-content: flex-start;
  height: 100vh;
  margin-top: 50px;
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signup, { error, isLoading, isError }] = useSignupMutation();

  async function sendVerificationEmail() {
    try {
      const templateParams = {
        to_email: email,
        from_name: 'Your App',
        subject: 'Welcome to Your App',
        message: 'Hello world!',
      };
      const response = await emailjs.send('service_eccrq4r', 'template_nj638eg', templateParams, 'Ime8DhelVtHYCGMCR');
      console.log('Email sent:', response);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    const response = await signup({ name, email, password });

    if (response.data) {
      // Send verification email
      sendVerificationEmail();
    }
  }

  return (
    <SignupContainer>
      <Row className="justify-content-center align-items-start" style={{ height: '100vh' }}>
        <Col md={6}>
          <FormContainer>
            <Form style={{ width: '100%' }} onSubmit={handleSignup}>
              <h1>Create Account</h1>
              <br />
              {isError && <Alert variant="danger">{error.data}</Alert>}
              <Form.Group as={Row} controlId="formName">
                <Form.Label column md={3}>
                  Name
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="text"
                    placeholder="Your name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <br />
              <Form.Group as={Row} controlId="formEmail">
                <Form.Label column md={3}>
                  Email Address
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <br />
              <Form.Group as={Row} controlId="formPassword" className="mb-3">
                <Form.Label column md={3}>
                  Password
                </Form.Label>
                <Col md={9}>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <br />
              <Form.Group>
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                >
                  Create account
                </Button>
              </Form.Group>
              <p className="pt-3 text-center">
                Have an account already? <Link to="/login" style={{ color: 'black' }}>Login</Link>{' '}
              </p>
            </Form>
          </FormContainer>
        </Col>
      </Row>
    </SignupContainer>
  );
};

export default Signup;
