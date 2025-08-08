import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/login";
import Mission from "./pages/mission";
import MainPage  from "./pages/MainPage";
import Play from "./PlayPage/App";
import Basic from "./pages/basic";
import Intermediate from "./pages/intermediate";
import Advanced from "./pages/advanced";

import EditorShell from "./pages/EditerShell";   // 또는 layouts/EditorShell
import MissionPage from "./pages/MissionPage";
export default function AppRouter() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/basic" element={<Basic />} />
        <Route path="/intermediate" element={<Intermediate />} />
        <Route path="/advanced" element={<Advanced />} />
        <Route path="/login" element={<Login />} />
        <Route path="/play" element={<Play/>}/>
        
        {/* 편집 화면이 필요한 라우트 (중첩) */}
        <Route element={<EditorShell />}>
          <Route path="/mission/:id" element={<MissionPage />} />
        </Route>

        <Route path="*" element={<Mission />} />
      </Routes>
    </>
  );
}
