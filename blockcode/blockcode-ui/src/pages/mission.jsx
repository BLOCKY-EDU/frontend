import React from "react";
import { useNavigate } from "react-router-dom";
import "./mission.css";
import star from "../assets/icons/star.png";

export default function Mission() {
  const navigate = useNavigate();

  const levels = [
    {
      label: "초급",
      path: "/basic",
      stars: 1,
      description: "BLOCKY를 처음해보신다면?",
    },
    {
      label: "중급",
      path: "/intermediate",
      stars: 3,
      description: "블록이 어떤식으로 사용되는지 알았다면?",
    },
    {
      label: "고급",
      path: "/advanced",
      stars: 5,
      description: "블록을 여러개 활용해보고싶다면?",
    },
  ];

  return (
    <div className="mission-container">
      <p className="mission-title">본인에게 맞는 레벨을 선택해 주세요</p>
      <div className="mission-cards">
        {levels.map((level) => (
          <div
            key={level.label}
            className="mission-card"
            onClick={() => navigate(level.path)}
          >
            <div className="star-container">
              {level.stars === 5 ? (
                <>
                  <div className="star-row">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <img
                        key={`row1-${idx}`}
                        src={star}
                        alt="star"
                        className="star-icon"
                      />
                    ))}
                  </div>
                  <div className="star-row">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <img
                        key={`row2-${idx}`}
                        src={star}
                        alt="star"
                        className="star-icon"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="star-row">
                  {Array.from({ length: level.stars }).map((_, idx) => (
                    <img
                      key={idx}
                      src={star}
                      alt="star"
                      className="star-icon"
                    />
                  ))}
                </div>
              )}
            </div>

            <span className="mission-text">{level.label}</span>
            <p className="mission-description">{level.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
