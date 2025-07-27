import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <AppRoutes />
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
