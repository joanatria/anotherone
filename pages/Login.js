import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../appApi';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  margin-top: 50px;
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isError, isLoading, error }] = useLoginMutation();

  function handleLogin(e) {
    e.preventDefault();
    login({ email, password });
  }

  return (
    <Container>
      <Row className="justify-content-center align-items-start" style={{ height: '100vh' }}>
        <Col md={6}>
          <FormContainer>
            <Form style={{ width: '100%' }} onSubmit={handleLogin}>
              <h1>Log In</h1>
              <br />
              {isError && <Alert variant="danger">{error.data}</Alert>}
              <Form.Group as={Row}>
                <Form.Label column md={4}>
                  Email Address
                </Form.Label>
                <Col md={8}>
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
              <Form.Group as={Row} className="mb-3">
                <Form.Label column md={4}>
                  Password
                </Form.Label>
                <Col md={8}>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
              </Form.Group>

              <Form.Group>
                <Button
                  type="submit"
                  disabled={isLoading}
                  style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}
                >
                  Login
                </Button>
              </Form.Group>

              <p className="pt-3 text-center">
                Don't have an account? <Link to="/signup" style={{ color: 'black' }}>Create account</Link>
              </p>
            </Form>
          </FormContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;