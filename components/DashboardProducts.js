import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDeleteProductMutation } from '../appApi';
import styled from 'styled-components';
import Pagination from './Pagination';

const ProductPreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const DashboardProductsTable = styled(Table)`
  th,
  td {
    white-space: nowrap;
  }
`;

const StyledDeleteButton = styled(Button)`
  &&& {
    border-color: #6d6d6d;
    color: #fff;
    background-color: #6d6d6d;
    transition: background-color 0.3s;
    border-radius: 0;
  }

  &&&:hover {
    background-color: #333;
  }
`;

const StyledEditButton = styled(Link)`
  &&& {
    background-color: #ddd;
    color: #888;
    border-color: #ccc;
    transition: background-color 0.3s;
    border-radius: 0;
  }

  &&&:hover {
    background-color: #ccc;
    color: #666;
  }
`;

function DashboardProducts() {
  const products = useSelector((state) => state.products);
  const user = useSelector((state) => state.user);
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  function handleDeleteProduct(id) {
    if (window.confirm('Are you sure?'))
      deleteProduct({ product_id: id, user_id: user._id });
  }

  const TableRow = ({ pictures, _id, name, price }) => (
    <tr>
      <td>
        <ProductPreviewImage src={pictures[0].url} alt="Product Preview" />
      </td>
      <td>{_id}</td>
      <td>{name}</td>
      <td>{price}</td>
      <td>
        <StyledDeleteButton
          onClick={() => handleDeleteProduct(_id, user._id)}
          disabled={isLoading}
        >
          Delete
        </StyledDeleteButton>
        <StyledEditButton to={`/product/${_id}/edit`} className="btn btn-warning">
          Edit
        </StyledEditButton>
      </td>
    </tr>
  );

  return (
    <DashboardProductsTable striped bordered hover responsive>
      <thead>
        <tr>
          <th></th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Product Price</th>
        </tr>
      </thead>
      <tbody>
        <Pagination
          data={products}
          RenderComponent={TableRow}
          pageLimit={1}
          dataLimit={5}
          tablePagination={true}
        />
      </tbody>
    </DashboardProductsTable>
  );
}

export default DashboardProducts;