import React, { useState } from 'react';
import { Alert, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../appApi';
import axios from '../axios';
import styled from 'styled-components';

const NewProductContainer = styled(Container)`
  width: 100%;
`;

const FormTitle = styled.h1`
  margin-top: 4rem;
`;

const SuccessAlert = styled(Alert)`
  margin-bottom: 1rem;
`;

const ErrorAlert = styled(Alert)`
  margin-bottom: 1rem;
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
`;

const ImagePreview = styled.div`
  width: 400px;
  display: inline-block;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
`;

const CloseIcon = styled.i`
  position: absolute;
  top: -12px;
  right: -12px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: orange;
  }
`;

const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  &&& {
    border-color: #6d6d6d;
    color: #fff;
    background-color: #6d6d6d;
    transition: background-color 0.3s;
    border-radius: 0;
    margin-top: 1rem;
  }

  &&&:hover {
    background-color: #333;
  }
`;

const NewProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [stocks, setStocks] = useState('');
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [createProduct, { isError, error, isLoading, isSuccess }] =
    useCreateProductMutation();

  const handleRemoveImg = (imgObj) => {
    setImgToRemove(imgObj.public_id);
    axios
      .delete(`/images/${imgObj.public_id}/`)
      .then((res) => {
        setImgToRemove(null);
        setImages((prev) =>
          prev.filter((img) => img.public_id !== imgObj.public_id)
        );
      })
      .catch((e) => console.log(e));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price || !category || !images.length || !stocks) {
      return alert('Please fill out all the fields');
    }
    createProduct({ name, description, price, category, images, stocks }).then(
      ({ data }) => {
        if (data.length > 0) {
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      }
    );
  };

  const showWidget = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqzmaeimy',
        uploadPreset: 'czpevpih',
      },
      (error, result) => {
        if (!error && result.event === 'success') {
          setImages((prev) => [
            ...prev,
            { url: result.info.url, public_id: result.info.public_id },
          ]);
        }
      }
    );
    widget.open();
  };

  return (
    <NewProductContainer>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <FormTitle>Add New Product</FormTitle>
            {isSuccess && (
              <SuccessAlert variant="success">Product created successfully!</SuccessAlert>
            )}
            {isError && <ErrorAlert variant="danger">{error?.message}</ErrorAlert>}
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="stocks">
              <Form.Label>Stocks</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product stocks"
                value={stocks}
                onChange={(e) => setStocks(e.target.value)}
              />
            </Form.Group>
            <StyledButton variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </StyledButton>
          </Form>
        </Col>
        <Col md={6}>
          <ImagePreviewContainer>
            {images.map((img) => (
              <ImagePreview key={img.public_id}>
                <CloseIcon
                  className="far fa-times-circle"
                  onClick={() => handleRemoveImg(img)}
                />
                <Image src={img.url} alt="Product" />
              </ImagePreview>
            ))}
          </ImagePreviewContainer>
          <UploadButtonContainer>
            <StyledButton onClick={showWidget}>Upload Images</StyledButton>
          </UploadButtonContainer>
        </Col>
      </Row>
    </NewProductContainer>
  );
};

export default NewProduct;
