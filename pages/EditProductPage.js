import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation } from '../appApi';
import axios from '../axios';
import styled from 'styled-components';

const EditProductContainer = styled(Container)`
  .new-product__form--container {
    width: 100%;
  }

  .images-preview-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100px, 100%), 1fr));
    gap: 10px;
    margin-top: 40px;
  }

  .image-preview {
    width: 100px;
    display: inline-block;
    position: relative;
  }

  .image-preview img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
  }

  .image-preview i,
  .remove-img-spinner {
    position: absolute;
    top: -12px;
    left: -12px;
    font-size: 20px;
    cursor: pointer;
  }

  .image-preview i:hover {
    color: orange;
  }

  .new-product__image--container {
    background-image: url(https://images.unsplash.com/photo-1652773899966-583e9d2f2fb0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHRlY2h8ZW58MHwxfDB8d2hpdGV8&auto=format&fit=crop&w=800&q=60);
    background-size: cover;
    background-position: center;
    height: 100vh;
  }
`;

function EditProductPage() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [stocks, setStocks] = useState(0); // New state variable for stocks
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [updateProduct, { isError, error, isLoading, isSuccess }] =
    useUpdateProductMutation();

  useEffect(() => {
    axios
      .get('/products/' + id)
      .then(({ data }) => {
        const product = data.product;
        setName(product.name);
        setDescription(product.description);
        setCategory(product.category);
        setImages(product.pictures);
        setPrice(product.price);
        setStocks(product.stocks); // Update the stocks value
      })
      .catch((e) => console.log(e));
  }, [id]);

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
    if (!name || !description || !price || !category || !images.length) {
      return alert('Please fill out all the fields');
    }
    updateProduct({
      id,
      name,
      description,
      price,
      category,
      images,
      stocks,
    }).then(({ data }) => {
      if (data.length > 0) {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    });
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
    <EditProductContainer>
      <Row>
        <Col md={6} className="new-product__form--container">
          <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
          <h1 className="mt-4" style={{ textAlign: 'left' }}>Edit product</h1>
          <br />
            {isSuccess && <Alert variant="success">Product updated</Alert>}
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Product Name</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Product Description</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  as="textarea"
                  placeholder="Product description"
                  style={{ height: '100px' }}
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Price(in US Dollars $)</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="number"
                  placeholder="Price ($)"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3" onChange={(e) => setCategory(e.target.value)}>
            <Row>
              <Col md={4}>
                <Form.Label>Category</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Select value={category}>
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
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Stocks</Form.Label>
              </Col>
              <Col md={8}>
                <Form.Control
                  type="number"
                  placeholder="Stocks"
                  value={stocks}
                  required
                  onChange={(e) => setStocks(e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Col md={4}>
            <Button type="button" onClick={showWidget} style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}>
              Upload Images
            </Button>
            </Col>
            <div className="images-preview-container">
              {images.map((image) => (
                <div className="image-preview">
                  <img src={image.url} alt="" />
                  {imgToRemove !== image.public_id && (
                    <i
                      className="fa fa-times-circle"
                      onClick={() => handleRemoveImg(image)}
                    ></i>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Form.Group>
        
            <Form.Group>
            <Col md={4}>
              <Button type="submit" disabled={isLoading || isSuccess} style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}>
                Update Product
              </Button>
            </Col>
            </Form.Group>
          </Form>
        </Col>
        {/* <Col md={6} className="new-product__image--container"></Col> */}
      </Row>
    </EditProductContainer>
  );
}

export default EditProductPage;