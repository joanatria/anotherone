// ...
import React from 'react';
import Navigation from '../components/Navigation';
import SearchResults from './SearchResults';

function SearchResultsPage({ searchQuery }) {
  if (!searchQuery) {
    return null; // Return null if searchQuery is empty or null to prevent rendering the page prematurely
  }

  return (
    <div>
      <Navigation />
      <SearchResults searchQuery={searchQuery} />
    </div>
  );
}

export default SearchResultsPage;
// ...