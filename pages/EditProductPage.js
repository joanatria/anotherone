import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation } from '../appApi';
import axios from '../axios';
import styled from 'styled-components';

const EditProductContainer = styled(Container)`
  display: flex;
  justify-content: space-between;

  .new-product__form--container {
    width: 55%; /* Adjusted width */
  }

  .new-product__image--container {
    width: 35%; /* Adjusted width */
    display: flex;
    align-items: center;
    justify-content: flex-end; /* Aligned to the right */
  }

  .upload-image-section {
    width: 100%;
    height: 400px;
  }

  .images-preview-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100px, 100%), 1fr));
    gap: 10px;
    margin-left: 280px;
  }

  .image-preview {
    width: 400px;
    display: inline-block;
    position: relative;
  }
  
  .image-preview img {
    width: 100%;
    height: 400px;
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
`;

const UploadButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Aligned to the right */
  margin-top: 2rem;
  width: 100%; /* Adjusted width */
`;

function EditProductPage() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [stocks, setStocks] = useState(0);
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
        setStocks(product.stocks);
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
      pictures: images,
      stocks,
    })
      .unwrap()
      .then(() => navigate('/'))
      .catch((e) => console.log(e));
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
            <h1 className="mt-4" style={{ textAlign: 'left' }}>
              Edit product
            </h1>
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

            <Form.Group className="mb-3">
              <Row>
                <Col md={4}>
                  <Form.Label>Category</Form.Label>
                </Col>
                <Col md={8}>
                  <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option disabled value="">
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

            <Form.Group>
              <Button
                type="submit"
                disabled={isLoading || isSuccess}
                style={{
                  backgroundColor: 'black',
                  borderColor: 'black',
                  color: 'white',
                  marginTop: '20px',
                }}
              >
                Update Product
              </Button>
            </Form.Group>
          </Form>
        </Col>

        <Col md={6} className="new-product__image--container">
          <div className="upload-image-section">
            <div className="images-preview-container">
              {images.map((image) => (
                <div className="image-preview" key={image.public_id}>
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
          <UploadButtonContainer>
          <Button
              type="button"
              onClick={showWidget}
              style={{
                backgroundColor: 'black',
                borderColor: 'black',
                color: 'white',
                marginTop: '500px',
                position: 'relative',
                width: '200px',
              }}
            >
              Upload Images
            </Button>
          </UploadButtonContainer>
        </Col>

      </Row>
    </EditProductContainer>
  );
}

export default EditProductPage;
