// SearchResults.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProducts } from '../features/productSlice';
import axios from 'axios';
import ProductPreview from '../components/ProductPreview';

function SearchResults() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);
  const searchQuery = new URLSearchParams(window.location.search).get('query'); // Get the search query from URL

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:8080/products/search/${searchQuery}`)
      .then(({ data }) => {
        dispatch(updateProducts(data));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [dispatch, searchQuery]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!products) {
    return null; // Return null if products is undefined or null to prevent rendering the products prematurely
  }

  if (products.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <div className="d-flex justify-content-center flex-wrap">
        {products.map((product) => (
          <ProductPreview key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;