import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookProvider>
          <CartProvider>
            <CustomCursor />
            <AppRoutes />
          </CartProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
