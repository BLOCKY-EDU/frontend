import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
const Login = lazy(() => import("./pages/login"));
const Mission = lazy(() => import("./pages/mission"));
const MainPage = lazy(() => import("./pages/MainPage"));
const Play = lazy(() => import("./PlayPage/App"));
const Basic = lazy(() => import("./pages/basic"));
const Intermediate = lazy(() => import("./pages/intermediate"));
const Advanced = lazy(() => import("./pages/advanced"));
const EditorShell = lazy(() => import("./pages/EditerShell"));
const MissionPage = lazy(() => import("./pages/MissionPage"));


export default function AppRouter() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div className="loading">Loading...</div>}>

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
      </Suspense>
    </>
  );
}
