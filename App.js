import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import NewProduct from './pages/NewProduct';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import ScrollToTop from './components/ScrollToTop';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPanel from './pages/AdminPanel';
import EditProductPage from './pages/EditProductPage';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { addNotification } from './features/userSlice';
import SearchResults from './pages/SearchResults';
import Announcement from './components/Announcement';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const socket = io('ws://localhost:8080');
    console.log('User:', user);
    console.log('isAdmin:', user && user.isAdmin);
  
    socket.off('notification').on('notification', (msgObj, user_id) => {
      // logic for notification
      if (user_id === user._id) {
        dispatch(addNotification(msgObj));
      }
    });
  
    socket.off('new-order').on('new-order', (msgObj) => {
      if (user && user.isAdmin) {
        dispatch(addNotification(msgObj));
      }
    });
  }, [user]);
  

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Announcement />
        <Navigation />
        <Routes>
          <Route index element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}

          {user && (
            <>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </>
          )}
          {user && user.isAdmin ? (
            <>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/product/:id/edit" element={<EditProductPage />} />
            </>
          ) : (
            <></>
          )}
          <Route path="/search" element={<SearchResults />} />

          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />

          <Route path="/new-product" element={<NewProduct />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;