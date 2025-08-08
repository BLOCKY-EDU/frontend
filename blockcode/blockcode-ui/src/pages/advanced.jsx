import React from "react";
import { useNavigate } from "react-router-dom";
import "./levels.css";
import { ADVANCED_PROBLEMS } from "../data/problems";

export default function Advanced() {
  const navigate = useNavigate();

  return (
    <div className="problems-container">
      {ADVANCED_PROBLEMS.map((p) => (
        <button
          key={p.id}
          className="problem-card"
          onClick={() => navigate(`/mission/${p.id}`)}
        >
          <small>문제 {p.id}</small>
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
        </button>
      ))}
    </div>
  );
}
