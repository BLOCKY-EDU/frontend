// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import App from './PlayPage/App.jsx';
// import MainPage from './pages/MainPage.jsx';
// import Layout from './Layout.jsx';
// import Login from './pages/login.jsx';
// import Mission from './pages/mission.jsx';
// import Basic from './pages/basic.jsx';
// import Intermediate from './pages/intermediate.jsx';
// import Advanced from './pages/advanced.jsx';
// import MissionPage from './pages/MissionPage.jsx';
// import EditorShell from './pages/EditerShell.jsx';
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<MainPage />} />
//           <Route path="/play" element={<App />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/play" element={<App />} />
//           <Route path="/mission" element={<Mission />} />
//         <Route path="/basic" element={<Basic />} />
//         <Route path="/intermediate" element={<Intermediate />} />
//         <Route path="/advanced" element={<Advanced />} />

//         <Route element={<EditorShell />}>
//         <Route path="/mission/:id" element={<MissionPage />} />
//       </Route>
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   </StrictMode>
// );

// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter"; // 라우트 모음 파일
import "./index.css"; // 글로벌 CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);
