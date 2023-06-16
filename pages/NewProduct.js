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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100px, 100%), 1fr));
  gap: 10px;
  margin-top: 40px;
`;

const ImagePreview = styled.div`
  width: 100px;
  display: inline-block;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
`;

const CloseIcon = styled.i`
  position: absolute;
  top: -12px;
  left: -12px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: orange;
  }
`;

const NewProductImageContainer = styled(Col)`
  background-image: url(https://images.unsplash.com/photo-1652773899966-583e9d2f2fb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHRlY2h8ZW58MHwxfDB8d2hpdGV8&auto=format&fit=crop&w=800&q=60);
  background-size: cover;
  background-position: center;
  height: 100vh;
`;

function NewProduct() {
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

  function handleRemoveImg(imgObj) {
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
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !images.length ||
      !stocks
    ) {
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
  }

  function showWidget() {
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
  }

  return (
    <NewProductContainer>
      <Row>
        <Col md={6}>
          <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <FormTitle>Create a product</FormTitle>
            {isSuccess && (
              <SuccessAlert variant="success">Product created with success</SuccessAlert>
            )}
            {isError && <ErrorAlert variant="danger">{error.data}</ErrorAlert>}
            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Product description"
                style={{ height: '100px' }}
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price ($)"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              onChange={(e) => setCategory(e.target.value)}
            >
              <Form.Label>Category</Form.Label>
              <Form.Select>
                <option disabled selected>
                  -- Select One --
                </option>
                <option value="Mac">Mac</option>
                <option value="iPad">iPad</option>
                <option value="iPhone">iPhone</option>
                <option value="Watch">Watch</option>
                <option value="AirPods">AirPods</option>
                <option value="Accessories">Accessories</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stocks</Form.Label>
              <Form.Control
                type="number"
                placeholder="Available stocks"
                value={stocks}
                required
                onChange={(e) => setStocks(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <ImagePreviewContainer>
                {images.map((image) => (
                  <ImagePreview>
                    <Image src={image.url} alt="" />
                    {imgToRemove !== image.public_id && (
                      <CloseIcon
                        className="fa fa-times-circle"
                        onClick={() => handleRemoveImg(image)}
                      ></CloseIcon>
                    )}
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            </Form.Group>

            <Form.Group>
              <Button type="submit" disabled={isLoading || isSuccess} style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}>
                Create Product
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <NewProductImageContainer md={6} />
      </Row>
    </NewProductContainer>
  );
}

export default NewProduct;