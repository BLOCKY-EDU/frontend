import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./levels.css";
import { LEVELS } from "../data/problems/index.js";
import locky_selected from "../assets/locky_selected.png";
import locky_unselected from "../assets/locky_unselected.png";

export default function Advanced() {
  const navigate = useNavigate();
  const ADVANCED_PROBLEMS = LEVELS.advanced;

  const [hoverId, setHoverId] = useState(null);

  return (
        <div className="problems-container">
          {ADVANCED_PROBLEMS.map((p) => {
            const isHover = hoverId === p.id;
            return (
              <button
                key={p.id}
                className="problem-card"
                onClick={() => navigate(`/mission/${p.id}`)}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(p.id)}    // 키보드 접근성
                onBlur={() => setHoverId(null)}
              >
                <div className="problem-number">고급 문제 {p.id}</div>
    
                {/* p.image 대신 고정 이미지 사용 + hover 시 교체 */}
                <img
                  src={isHover ? locky_selected : locky_unselected}
                  alt={p.title}
                  className="problem-image"
                />
    
                <h3>{p.title}</h3>
              </button>
            );
          })}
        </div>
      );
}
