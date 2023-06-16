import axios from '../axios';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ProductPreview from '../components/ProductPreview';
import Pagination from '../components/Pagination';
import styled from 'styled-components';

const CategoryPageContainer = styled.div`
  min-height: 90vh;
`;

const SearchContainer = styled.div`
  border: 0.25px solid white;
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-left: 25px;
  padding: 5px;
  cursor: pointer;
`;

const CategoryBannerContainer = styled.div`
  background-color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
  margin-left: 75px;
  margin-top: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-left: 40px;
`;

const Input = styled.input`
  border: none;
  width: ${({ showInput }) => (showInput ? '300px' : '0')};
  opacity: ${({ showInput }) => (showInput ? '1' : '0')};
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  transition: width 0.3s, opacity 0.3s;
  text-align: center;
`;

const NoProductsText = styled.h1`
  text-align: center;
`;

function CategoryPage() {
  const { category } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showInput, setShowInput] = useState(false);
  const handleSearchIconClick = () => {
    setShowInput(true);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/products/category/${category}`)
      .then(({ data }) => {
        setLoading(false);
        setProducts(data);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
  }, [category]);

  if (loading) {
    return <Loading />;
  }

  const productsSearch = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function ProductSearch({ _id, category, name, pictures, stocks }) {
    return (
      <ProductPreview
        _id={_id}
        category={category}
        name={name}
        pictures={pictures}
        stocks={stocks} // Pass the stocks prop to ProductPreview component
      />
    );
  }

  return (
    <CategoryPageContainer>
      <CategoryBannerContainer className={`${category}-banner-container`}>
      <h1 className="text-center">
        {category === "all" ? "Store" : category}
      </h1>
      </CategoryBannerContainer>
      <FiltersContainer>
      <SearchContainer onClick={handleSearchIconClick}>
      <SearchIcon style={{ color: 'gray', fontSize: 20 }} />
      <Input
        showInput={showInput}
        type="search"
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowInput(true)}
        onBlur={() => setShowInput(false)}
      />
      </SearchContainer>
      </FiltersContainer>
      {productsSearch.length === 0 ? (
        <NoProductsText>No Products</NoProductsText>
      ) : (
        <Container>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              <Pagination
                data={productsSearch}
                RenderComponent={ProductSearch}
                pageLimit={3}
                dataLimit={8}
                tablePagination={false}
              />
            </Col>
          </Row>
        </Container>
      )}
    </CategoryPageContainer>
  );
}

export default CategoryPage;