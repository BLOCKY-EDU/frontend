import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import logo from "../assets/blocky-logo.png";

export default function NavBar() {
  return (
    <header className="nav-header">
      <div className="nav-left">
        <Link to="/">
          <img src={logo} alt="Blocky Logo" className="nav-logo" />
        </Link>
        <Link to="/">서비스 소개</Link>
        <Link to="/play">자유롭게 놀기</Link>
        <Link to="/mission">미션 수행하기</Link>
      </div>
      <div className="nav-right">
        <Link to="/login">로그인</Link>
        <Link to="/signup">회원가입</Link>
      </div>
    </header>
  );
}