import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowLeftOutlined, ArrowRightOutlined } from "@mui/icons-material";

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationItem = styled.button`
  background: #fff;
  border: 2px solid #666;
  padding: 10px 15px;
  border: none;
  height: 45px;
  width: 45px;
  position: relative;
  margin: 0 5px;
  cursor: pointer;
  position: relative;

  &.active {
    background-color: #999;
  }
`;

const PaginationText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Pagination({
  data,
  RenderComponent,
  title,
  pageLimit,
  dataLimit,
  tablePagination,
}) {
  const [pages] = useState(Math.floor(data.length / dataLimit) + 1);
  const [currentPage, setCurrentPage] = useState(1);

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  function changePage(event) {
    const pageNumber = Number(event.target.textContent);
    setCurrentPage(pageNumber);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    return data.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;

    return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
  };

  return (
    <>
      {tablePagination ? (
        getPaginatedData().map((data, idx) => (
          <RenderComponent key={idx} {...data} />
        ))
      ) : (
        <div className="dataContainer d-flex justify-content-center flex-wrap">
          <h1>{title}</h1>

          {getPaginatedData().map((data, idx) => (
            <RenderComponent key={idx} {...data} />
          ))}
        </div>
      )}

      {data.length > dataLimit && (
        <PaginationContainer>
          <ArrowLeftOutlined
            onClick={goToPreviousPage}
            className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
          >
          </ArrowLeftOutlined>
          {getPaginationGroup().map((item, index) => (
            <PaginationItem
              key={index}
              onClick={changePage}
              className={`paginationItem ${
                currentPage === item ? 'active' : ''
              }`}
            >
              <PaginationText>{item}</PaginationText>
            </PaginationItem>
          ))}
          <ArrowRightOutlined
            onClick={goToNextPage}
            className={`next ${currentPage >= pages ? 'disabled' : ''}`}
          >
          </ArrowRightOutlined>
        </PaginationContainer>
      )}
    </>
  );
}