import React, { useState } from "react";
import "./login.css";
import logo from '../assets/blocky-logo.png';
export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    name: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && form.password !== form.confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert(isSignUp ? "회원가입 성공!" : "로그인 성공!");
    // TODO: 실제 API 연동
  };

  return (
    <div className="login-main-container">
      <div className="main-box" style={{ maxWidth: 400, width: "100%" }}>

      <img
          src={logo}
          alt="Logo"
          className="auth-logo"
          style={{ width: 200,marginTop:20, marginBottom: 45, display: "block", marginLeft: "auto", marginRight: "auto" }}
        />

        <div className="main-title-text" style={{ marginBottom: 24 }}>
          {/* {isSignUp ? "회원가입" : "로그인"} */}
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              className="auth-input"
              type="text"
              name="name"
              value={form.name}
              placeholder="이름"
              onChange={handleChange}
              required
            />
          )}
          <input
            className="auth-input"
            type="email"
            name="email"
            value={form.email}
            placeholder="이메일"
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            value={form.password}
            placeholder="비밀번호"
            onChange={handleChange}
            required
          />
          {isSignUp && (
            <input
              className="auth-input"
              type="password"
              name="confirm"
              value={form.confirm}
              placeholder="비밀번호 확인"
              onChange={handleChange}
              required
            />
          )}
          <button className="auth-btn" type="submit">
            {isSignUp ? "회원가입" : "로그인"}
          </button>
        </form>
        <div className="auth-toggle">
          {isSignUp ? (
            <>
              이미 계정이 있으신가요?
              <button onClick={() => setIsSignUp(false)} className="auth-toggle-btn">
                로그인
              </button>
            </>
          ) : (
            <>
              계정이 없으신가요?
              <button onClick={() => setIsSignUp(true)} className="auth-toggle-btn">
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
