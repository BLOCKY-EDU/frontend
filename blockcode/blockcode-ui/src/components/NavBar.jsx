import React from "react";
import "./NavBar.css";
import logo from "../assets/blocky-logo.png";

export default function NavBar() {
  return (
    <header className="header">
    <div className="nav-left">
        <img src={logo} alt="Blocky Logo" className="logo" />
        <a href="#">서비스 소개</a>
        <a href="#">자유롭게 놀기</a>
        <a href="#">미션 수행하기</a>
    </div>
    <div className="nav-right">
        <a href="#">로그인</a>
        <a href="#">회원가입</a>
    </div>
    </header>  
  );
}