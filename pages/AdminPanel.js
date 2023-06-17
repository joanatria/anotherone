import { Container, Nav, Tab, Col, Row } from 'react-bootstrap';
import ClientsAdminPage from '../components/ClientsAdminPage';
import DashboardProducts from '../components/DashboardProducts';
import OrdersAdminPage from '../components/OrdersAdminPage';
import NewProduct from './NewProduct';
import styled from 'styled-components';

const CustomNav = styled(Nav)`
  && {
    background-color: transparent;
  }
`;

const NavLinkCustom = styled(Nav.Link)`
  && {
    color: black;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
    cursor: pointer;
  }

  &&:hover,
  &&:focus,
  &&:active {
    color: black !important;
    background-color: transparent !important;
    box-shadow: none !important;
    outline: 2px solid gray !important;
    font-weight: bold;
  }

  &&:hover {
    background-color: transparent !important;
  }

  &&:focus,
  &&:active {
    box-shadow: none !important;
    background-color: transparent !important;
  }
  
  &&:focus {
    outline-offset: -2px !important;
  }
`;

function AdminPanel() {
  return (
    <Container>
      <Tab.Container defaultActiveKey="products">
        <Row className="mt-4 mb-4">
          <Col sm={12}>
            <CustomNav variant="pills" className="justify-content-center">
              <Nav.Item>
                <NavLinkCustom eventKey="products">Products</NavLinkCustom>
              </Nav.Item>
              <Nav.Item>
                <NavLinkCustom eventKey="orders">Orders</NavLinkCustom>
              </Nav.Item>
              <Nav.Item>
                <NavLinkCustom eventKey="clients">Clients</NavLinkCustom>
              </Nav.Item>
              <Nav.Item>
                <NavLinkCustom eventKey="create-products">Create Product</NavLinkCustom>
              </Nav.Item>
            </CustomNav>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <DashboardProducts />
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="clients">
                <ClientsAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="create-products">
                <NewProduct />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminPanel;