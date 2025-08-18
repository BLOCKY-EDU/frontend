import React from "react";
import { useNavigate } from "react-router-dom";
import "./levels.css";
import { LEVELS } from "../data/problems/index.js";
//import { INTERMEDIATE_PROBLEMS } from "../data/problems";

export default function Intermediate() {
  const navigate = useNavigate();
  const INTERMEDIATE_PROBLEMS = LEVELS.intermediate;

  return (
    <div className="problems-container">
      {INTERMEDIATE_PROBLEMS.map((p) => (
        <button
          key={p.id}
          className="problem-card"
          onClick={() => navigate(`/mission/${p.id}`)}
        >
          <div className="problem-number">중급 문제 {p.id}</div>
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
        </button>
      ))}
    </div>
  );
}
