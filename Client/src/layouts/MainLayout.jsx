import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="app-wrapper">
      {/* Top sticky Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content container animate-fade-in">
        {children}
      </main>

      {/* Bottom Footer Section */}
      <Footer />
    </div>
  );
};

export default MainLayout;
