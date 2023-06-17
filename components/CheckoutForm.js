import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { Alert, Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../appApi';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user);
  const [alertMessage, setAlertMessage] = useState('');
  const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [paying, setPaying] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  async function handlePay(e) {
    e.preventDefault();
    if (!stripe || !elements || user.cart.count <= 0) return;
    setPaying(true);
    const { client_secret } = await fetch('http://localhost:8080/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ',
      },
      body: JSON.stringify({ amount: user.cart.total }),
    }).then((res) => res.json());

    if (selectedPaymentMethod === 'Cash on Delivery') {
      setPaying(false);
      createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
        if (!isLoading && !isError) {
          setAlertMessage('Payment completed (Cash on Delivery)');
          setTimeout(() => {
            // navigate("/orders");
          }, 3000);
        }
      });
    } else if (selectedPaymentMethod === 'Credit/Debit Card') {
      const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      setPaying(false);

      if (paymentIntent) {
        createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
          if (!isLoading && !isError) {
            setAlertMessage(`Payment ${paymentIntent.status}`);
            setTimeout(() => {
              // navigate("/orders");
            }, 3000);
          }
        });
      }
    }
  }

  const handleTogglePaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  return (
    <Col className="cart-payment-container">
      <h4 style={{ fontSize: '40px', marginBottom: '20px' }}>Checkout</h4>
      <Form onSubmit={handlePay}>
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="First Name" value={user.name} disabled />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Email" value={user.email} disabled />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <h4>Select Payment Method</h4>
              <ButtonGroup>
                <Button
                  variant={selectedPaymentMethod === 'Cash on Delivery' ? 'primary' : 'outline-primary'}
                  onClick={() => handleTogglePaymentMethod('Cash on Delivery')}
                >
                  Cash on Delivery
                </Button>
                <Button
                  variant={selectedPaymentMethod === 'Credit/Debit Card' ? 'primary' : 'outline-primary'}
                  onClick={() => handleTogglePaymentMethod('Credit/Debit Card')}
                >
                  Credit/Debit Card
                </Button>
              </ButtonGroup>
            </Form.Group>
          </Col>
        </Row>
        {selectedPaymentMethod === 'Credit/Debit Card' && (
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <CardElement />
              </Form.Group>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <Button
              className="mt-3"
              type="submit"
              style={{ width: '23%', borderRadius: '2', fontSize: '20px' }}
              disabled={user.cart.count <= 0 || paying || isSuccess || !selectedPaymentMethod}
              variant="dark"
            >
              {paying ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Col>
  );
}

export default CheckoutForm;