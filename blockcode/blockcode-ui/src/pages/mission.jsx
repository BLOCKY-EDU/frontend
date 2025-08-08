import React from "react";
import { useNavigate } from "react-router-dom";
import "./mission.css"; // 스타일 분리 가능

export default function Mission() {
  const navigate = useNavigate();

  return (
    <div className="mission-container">
      <h2 className="mission-title">본인에게 맞는 레벨을 선택해 주세요</h2>
      <div className="mission-cards">
        <div className="mission-card" onClick={() => navigate("/basic")}>
          <span className="mission-text">초급</span>
        </div>
        <div className="mission-card" onClick={() => navigate("/intermediate")}>
          <span className="mission-text">중급</span>
        </div>
        <div className="mission-card" onClick={() => navigate("/advanced")}>
          <span className="mission-text">고급</span>
        </div>
      </div>
    </div>
  );
}
