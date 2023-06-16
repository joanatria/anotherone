import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const ToastMessage = ({ bg, title, body }) => {
  const [show, setShow] = useState(true);

  return (
    <Container>
      <ToastContainer position="bottom-right" className="toast-container">
        <Toast bg={bg} onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">{title}</strong>
            <small>now</small>
          </Toast.Header>
          <Toast.Body>{body}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ToastMessage;