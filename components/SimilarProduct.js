import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';

const StyledSimilarProductCard = styled(Card)`
  width: 150px;
  height: auto;
  border: none;
  transition: box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const StyledSimilarProductImgContainer = styled.div`
  height: 0;
  padding-bottom: 100%; /* Maintain aspect ratio */
  position: relative;
  overflow: hidden;
`;

const StyledSimilarProductImgWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledSimilarProductImg = styled(Card.Img)`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const StyledSimilarProductBody = styled(Card.Body)`
  padding: 1rem;
`;

const StyledSimilarProductTitle = styled(Card.Title)`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const StyledSimilarProductCategory = styled(Badge)`
  font-size: 0.9rem;
  padding: 0.2rem 0.5rem;
  background-color: transparent;
  color: black;
`;

function SimilarProduct({ _id, name, category, pictures }) {
  return (
    <LinkContainer to={`/product/${_id}`} style={{ textDecoration: 'none' }}>
      <StyledSimilarProductCard>
        <StyledSimilarProductImgContainer>
          <StyledSimilarProductImgWrapper>
            <StyledSimilarProductImg variant="top" src={pictures[0].url} />
          </StyledSimilarProductImgWrapper>
        </StyledSimilarProductImgContainer>
        <StyledSimilarProductBody>
          <StyledSimilarProductTitle>{name}</StyledSimilarProductTitle>
          <StyledSimilarProductCategory bg="light" text="dark">
            {category}
          </StyledSimilarProductCategory>
        </StyledSimilarProductBody>
      </StyledSimilarProductCard>
    </LinkContainer>
  );
}

export default SimilarProduct;