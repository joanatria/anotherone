import React from 'react';
import { Badge, Card, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';

const StyledProductPreview = styled(Card)`
  margin: 0;
  border: none;
  box-shadow: none;
`;

const StyledProductName = styled(Card.Title)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function ProductPreview({ _id, category, name, pictures, stocks }) {
  const isAvailable = stocks > 0;

  return (
    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
      <LinkContainer to={`/product/${_id}`} style={{ cursor: 'pointer' }}>
        <StyledProductPreview className={`product-card ${!isAvailable ? 'unavailable' : ''}`}>
          {pictures && pictures.length > 0 && (
            <Card.Img
              variant="top"
              className="product-preview-img"
              src={pictures[0].url}
              style={{ height: '200px', objectFit: 'contain' }}
            />
          )}
          <Card.Body>
            <StyledProductName>{name}</StyledProductName>
            <Badge bg="light" text="dark" style={{ color: 'black' }}>
              {category}
            </Badge>
            {!isAvailable && (
              <Badge bg="danger" className="ms-2">
                Unavailable
              </Badge>
            )}
          </Card.Body>
        </StyledProductPreview>
      </LinkContainer>
    </Col>
  );
}

export default ProductPreview;