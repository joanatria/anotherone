import axios from '../axios';
import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Container, Row, Col, Badge, ButtonGroup, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import { LinkContainer } from 'react-router-bootstrap';
import { useAddToCartMutation } from '../appApi';
import ToastMessage from '../components/ToastMessage';
import styled from 'styled-components';

const ProductCarouselImage = styled.img`
  max-width: 100%;
  object-fit: cover;
  max-height: 500px;
`;

const StyledButton = styled(Button)`
  &&& {
    border-color: #000;
    color: #000;
  }
`;

const EditButton = styled(StyledButton)`
  &&& {
    border-color: #000;
    color: #fff;
    background-color: #000;
    transition: background-color 0.3s;
    border-radius: 0;
  }

  &&&:hover {
    background-color: #333;
  }
`;

const AddToCartButton = styled(StyledButton)`
  &&& {
    border-color: #000;
    color: #fff;
    background-color: #000;
    transition: background-color 0.3s;
    border-radius: 0;
  }

  &&&:hover {
    background-color: #333;
  }
`;

const ProductPageContainer = styled(Container)`
  position: relative;
`;

const ProductName = styled.h1`
  font-family: 'San Francisco', 'Helvetica Neue', Arial, sans-serif;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-family: 'San Francisco', 'Helvetica Neue', Arial, sans-serif;
  font-size: 24px;
  font-style: italic;
  margin-bottom: 10px;
`;

const ProductPage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState(null);
  const [addToCart, { isSuccess }] = useAddToCartMutation();

  const handleDragStart = (e) => e.preventDefault();

  useEffect(() => {
    axios.get(`/products/${id}`).then(({ data }) => {
      setProduct(data.product);
      setSimilar(data.similar);
    });
  }, [id]);

  if (!product) {
    return <Loading />;
  }

  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  const images = product.pictures.map((picture) => (
    <ProductCarouselImage src={picture.url} alt="" onDragStart={handleDragStart} />
  ));

  let similarProducts = [];
  if (similar) {
    similarProducts = similar.map((product, idx) => (
      <div className="item" data-value={idx} key={product.id}>
        <SimilarProduct {...product} />
      </div>
    ));
  }

  return (
    <ProductPageContainer className="pt-4">
      <Row>
        <Col lg={6}>
          <AliceCarousel mouseTracking items={images} controlsStrategy="alternate" />
        </Col>
        <Col lg={6} className="pt-4">
          <ProductName>{product.name}</ProductName>
          <p>
            <Badge bg="light" text="dark" style={{ color: 'black' }}>{product.category}</Badge>
          </p>
          <ProductPrice className="product__price">${product.price}</ProductPrice>
          <p style={{ textAlign: 'justify' }} className="py-3">
            {product.description}
          </p>
          {user && !user.isAdmin && (
            <ButtonGroup style={{ width: '90%' }}>
              {/* <Form.Select size="lg" style={{ width: '40%', borderRadius: '0' }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Form.Select> */}
              <AddToCartButton
                size="lg"
                onClick={() =>
                  addToCart({
                    userId: user._id,
                    productId: id,
                    price: product.price,
                    image: product.pictures[0].url,
                  })
                }
              >
                Add to Cart
              </AddToCartButton>
            </ButtonGroup>
          )}
          {user && user.isAdmin && (
            <LinkContainer to={`/product/${product._id}/edit`}>
              <EditButton size="lg">Edit Product</EditButton>
            </LinkContainer>
          )}
          {isSuccess && (
            <ToastMessage
              bg="info"
              title="Added to Cart"
              body={`${product.name} is in your cart`}
            />
          )}
        </Col>
      </Row>
      <div className="my-4">
        <h2>You might also like...</h2>
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <AliceCarousel
            mouseTracking
            items={similarProducts}
            responsive={responsive}
            controlsStrategy="alternate"
          />
        </div>
      </div>
    </ProductPageContainer>
  );
};

export default ProductPage;