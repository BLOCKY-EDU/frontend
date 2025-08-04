import React from "react";
import "./MainPage.css";
import NavBar from "../components/NavBar";
import logo from "../assets/blocky-logo.png";

export default function MainPage() {
  return (
    <div className="container">
      <NavBar />
      <div className="main-box" />
      <img className="main-image" src={logo} alt="logo" />
      
      <div className="title-text">
        웹 프론트엔드, 어렵다고 느끼셨나요?<br />
        HTML, CSS 아직 낯설고 복잡하셨나요?
      </div>
      <div className="sub-text">
        블록키는 초보자도 쉽게 웹 UI를 만들 수 있는<br />
        블록코딩 기반 웹 프론트 개발 학습 플랫폼입니다.
      </div>
      <div className="middle-text">그래서 만들었습니다.</div>
      <div className="highlight-text">
        블록처럼 쌓아가며 배우는 웹 프론트엔드
      </div>

      <div className="card-container">
        <div className="card">한국어로 된 직관적인 블록</div>
        <div className="card">구조는 ‘화면’ 꾸미기는 ‘스타일’ 블록으로!</div>
        <div className="card">드래그만 하면 바로 스타일 코드가 만들어져요</div>
      </div>
    </div>
  );
}