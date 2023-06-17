import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutForm from '../components/CheckoutForm';
import {
  useIncreaseCartProductMutation,
  useDecreaseCartProductMutation,
} from '../appApi';

const stripePromise = loadStripe(
  'pk_test_51NJ7MPJnBsLyYEwfYhxYAZYN1aOZkyyixlHlEUBxELQ8JVH38o5cWqiJ9B4VPgBETtOaw2iTTL0pGBPaGYYFX2yB00HrqGWDUw'
);

const styles = `
  .fa-plus-circle,
  .fa-minus-circle {
    cursor: pointer;
    display: inline-block;
  }

  .fa-plus-circle {
    margin-left: 5px;
  }

  .fa-minus-circle {
    margin-right: 5px;
  }

  .table-responsive-sm {
    max-height: 70vh;
    overflow: scroll;
  }
  
  .page-label {
    margin-bottom: 10px;
  }
`;

function CartPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const userCartObj = user.cart;
  let cart = products.filter((product) => userCartObj[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  function calculateTotal() {
    let totalValue = 0;
    for (const item of cart) {
      const quantity = user.cart[item._id];
      totalValue += item.price * quantity;
    }
    setTotal(totalValue);
  }

  function handleDecrease(product) {
    const quantity = userCartObj[product.productId];
    if (quantity <= 1) return;
    decreaseCart(product);
  }
  

  function handleRemove(productId) {
    const updatedCart = { ...user.cart };
    delete updatedCart[productId];
    dispatch({ type: 'UPDATE_CART', payload: updatedCart });
  }

  return (
    <Container style={{ minHeight: '95vh' }} className="cart-container">
      <style>{styles}</style>
      <Row>
        <Col>
          <h1 className="pt-2 h3 page-label" style={{ fontSize: '40px', marginBottom: '20px' }}>Shopping cart</h1>
          {cart.length === 0 ? (
            <Alert variant="info" className="page-label">
              Shopping cart is empty. Add products to your cart.
            </Alert>
          ) : (
            <>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>&nbsp;</td>
                      <td>
                        <i
                          className="fa fa-times"
                          style={{ marginRight: 10, cursor: 'pointer' }}
                          onClick={() => handleRemove(item._id)}
                        ></i>
                        <img
                          src={item.pictures[0].url}
                          alt=""
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                          }}
                        />
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <span className="quantity-indicator">
                          <i
                            className="fa fa-minus-circle"
                            onClick={() =>
                              handleDecrease({
                                product: {
                                  productId: item._id,
                                  price: item.price,
                                  userId: user._id,
                                }
                              })
                            }
                          ></i>
                          <span>{user.cart[item._id]}</span>
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              increaseCart({
                                productId: item._id,
                                price: item.price,
                                userId: user._id,
                              })
                            }
                          ></i>
                        </span>
                      </td>
                      <td>${item.price * user.cart[item._id]}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4 page-label" style={{ fontSize: '24px', marginBottom: '50px' }}>{total}.00 USD</h3>
              </div>
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CartPage;