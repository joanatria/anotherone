import axios from 'axios';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import categories from '../categories';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { updateProducts } from '../features/productSlice';
import ProductPreview from '../components/ProductPreview';
import Slider from '../components/Slider';

const FeaturedProductsContainer = styled.div`
  margin-top: 4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  border: none;

  a {
    text-align: right;
    display: block;
    text-decoration: none;
    border: none;
  }
`;

const RecentProductsContainer = styled.div`
  margin-top: 4rem;
  border: none;

  .category-tile {
    height: 250px;
    background-size: cover;
    background-position: center;
    padding-left: 20px !important;
    padding-right: 20px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 30px;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 30px;
    border: none;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const lastProducts = products.slice(0, 8);

  useEffect(() => {
    axios
      .get('http://localhost:8080/products')
      .then(({ data }) => dispatch(updateProducts(data)));
  }, [dispatch]);

  return (
    <div>
      <Slider />
      <FeaturedProductsContainer>
        {/* top products here */}
        <div className="d-flex justify-content-center flex-wrap">
          {lastProducts.map((product) => (
            <ProductPreview key={product.id} {...product} />
          ))}
        </div>
        <br/>
          <Link to="/category/all" style={{ color: 'black' }}>View All</Link>
      </FeaturedProductsContainer>
      <RecentProductsContainer>
        <Row>
        {categories.map((category) => (
            <LinkContainer
              to={`/category/${category.name}`}
            >
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                    gap: '10px',
                  }}
                  className="category-tile"
                >
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </RecentProductsContainer>
    </div>
  );
}

export default Home;