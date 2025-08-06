import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './PlayPage/App.jsx';
import MainPage from './pages/MainPage.jsx';
import Layout from './Layout.jsx';
import Login from './pages/login.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/play" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/play" element={<App />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>
);