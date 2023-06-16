import axios from '../axios';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import React, { useRef, useState } from 'react';
import AppleIcon from '@mui/icons-material/Apple';
import {Navbar, Button, Nav, NavDropdown, Container, Form, FormControl} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout, resetNotifications } from '../features/userSlice';
import { updateProducts } from '../features/productSlice';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LogoutButton = styled(Button)`
  margin: 0 auto;
  display: block !important;
  border: none;
  background-color: transparent;
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  color: black;
  &&&:hover {
    color: black !important;
    background-color: transparent !important;
  }
`;

const CartCount = styled.span`
  font-size: 10px;
  background-color: red;
  color: white;
  padding: 2px 4px;
  vertical-align: top;
  margin-left: -8px;
  border-radius: 50%;
  margin-top: -5px;
`;

const Input = styled.input`
  border: none;
  width: ${({ showInput }) => (showInput ? '300px' : '0')};
  opacity: ${({ showInput }) => (showInput ? '1' : '0')};
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  transition: width 0.3s, opacity 0.3s;
`;

const SearchContainer = styled.div`
  border: 0.25px solid white;
  display: flex;
  align-items: center;
  margin-top: 14px;
  margin-left: 25px;
  padding: 5px;
  cursor: pointer;
`;

const NotificationsContainer = styled.div`
  padding: 20px;
  max-height: 200px;
  overflow-y: scroll;
  border: 1px solid gray;
  background-color: white;
  width: 200px;
  z-index: 99;
`;

const Notification = styled.p`
  &.notification-read {
    background-color: lightblue;
  }

  &.notification-unread {
    background-color: lightcoral;
  }
`;

const BellIcon = styled.i`
  font-size: 1.5em;
`;

const NavigationBar = styled(Navbar)`
  th,
  td {
    white-space: nowrap;
  }
`;

const AppleNavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 10;
`;

const AppleNavLink = styled.li`
  margin-left: 10px;
  margin-right: 30px;
  margin-top: 20px; /* Adjust the margin-top value to move the links down */

  &:last-child {
    margin-right: 0;
  }

  p {
    color: black;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
    cursor: pointer;

    &:hover {
      color: #999;
    }
  }
`;

function Navigation() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

 const handleStoreClick = () => {
    navigate(`/category/all`);
  };

  const handleMacClick = () => {
    navigate(`/category/Mac`);
  };
 
  const handleIpadClick = () => {
    navigate(`/category/iPad`);
  };
 
  const handleIphoneClick = () => {
    navigate(`/category/iPhone`);
  };
 
  const handleWatchClick = () => {
    navigate(`/category/Watch`);
  };
 
  const handleAirpodsClick = () => {
    navigate(`/category/AirPods`);
  };
 
  const handleAccClick = () => {
    navigate(`/category/Accessories`);
  };

  const [showInput, setShowInput] = useState(false);
  const handleSearchIconClick = () => {
    setShowInput(true);
  };

  function handleLogout() {
    dispatch(logout());
  }

  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === 'unread') return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display =
      notificationRef.current.style.display === 'block' ? 'none' : 'block';
    dispatch(resetNotifications());
    if (unreadNotifications > 0)
      axios.post(`/users/${user._id}/updateNotifications`);
  }

  function handleSearch(e) {
    e.preventDefault();
    axios
      .get(`http://localhost:8080/products/search/${searchQuery}`)
      .then(({ data }) => {
        dispatch(updateProducts(data));
        navigate(`/search?query=${searchQuery}`);
      })
      .catch((error) => console.log(error));
  }

  function handleInputChange(e) {
    setSearchQuery(e.target.value);
  }

  return (
    <NavigationBar expand="lg">
      <Container>
        <LinkContainer to="/">
          <NavigationBar.Brand>
          <AppleIcon />
          </NavigationBar.Brand>
        </LinkContainer>
        <AppleNavLinks>
           <AppleNavLink>
             <p onClick={handleStoreClick}>Store</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleMacClick}>Mac</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleIpadClick}>iPad</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleIphoneClick}>iPhone</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleWatchClick}>Watch</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleAirpodsClick}>AirPods</p>
           </AppleNavLink>
           <AppleNavLink>
             <p onClick={handleAccClick}>Accessories</p>
           </AppleNavLink>
         </AppleNavLinks>
        <NavigationBar.Toggle aria-controls="basic-navbar-nav" />
        <NavigationBar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <form onSubmit={handleSearch}>
            <SearchContainer onClick={handleSearchIconClick}>
              <SearchIcon style={{ color: 'gray', fontSize: 20 }} />
              <Input
                showInput={showInput}
                type="search"
                placeholder="Search"
                className="mr-2"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowInput(true)}
                onBlur={() => setShowInput(false)}
              />
            </SearchContainer>
          </form>
            {!user && (
              <LinkContainer to="/login">
                <AppleNavLink><p >Login</p></AppleNavLink>
              </LinkContainer>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                 <ShoppingBagOutlinedIcon className="fas fa-shopping-cart" style={{ marginTop: '10px' }}></ShoppingBagOutlinedIcon>
                  {user.cart?.count > 0 && (
                    <CartCount id="cartcount" className="badge badge-warning" style={{ marginTop: '7px' }}>
                      {user.cart.count}
                    </CartCount>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <>
                <Nav.Link style={{ display: 'none', position: 'relative' }}  onClick={handleToggleNotifications}>
                  <BellIcon className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></BellIcon>
                </Nav.Link>
                {user && (
                  <>
                    {user.isAdmin ? (
                      <LinkContainer to="/admin" style={{ fontSize: '14px' }}>
                        <AppleNavLink><p >Admin Panel</p></AppleNavLink>
                      </LinkContainer>
                    ) : (
                      <>
                        <LinkContainer to="/cart">
                        <AppleNavLink><p >View my Bag</p></AppleNavLink>
                        </LinkContainer>
                        <LinkContainer to="/orders">
                        <AppleNavLink><p >View my Orders</p></AppleNavLink>
                        </LinkContainer>
                      </>
                    )}
                    <LogoutButton onClick={handleLogout} className="logout-btn">Log Out</LogoutButton>
                  </>
                )}
              </>
            )}
          </Nav>
        </NavigationBar.Collapse>
      </Container>
      <NotificationsContainer
        ref={notificationRef}
        style={{
          position: 'absolute',
          top: `${bellPos.top + 30}px`,
          left: `${bellPos.left}px`,
          display: 'none',
        }}
      >
        {user?.notifications?.length > 0 ? (
          user.notifications.map((notification) => (
            <Notification
              className={`notification-${notification.status}`}
              key={notification.id}
            >
              {notification.message}
              <br />
              <span>
                {notification.time.split('T')[0] + ' ' + notification.time.split('T')[1]}
              </span>
            </Notification>
          ))
        ) : (
          <Notification>No notifications yet</Notification>
        )}
      </NotificationsContainer>
    </NavigationBar>
  );
}

export default Navigation;