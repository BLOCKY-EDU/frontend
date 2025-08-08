import React from "react";
import { useNavigate } from "react-router-dom";
import "./levels.css";
import { BASIC_PROBLEMS } from "../data/problems";

export default function Basic() {
  const navigate = useNavigate();

  return (
    <div className="problems-container">
      {BASIC_PROBLEMS.map((p) => (
        <button
          key={p.id}
          className="problem-card"
          onClick={() => navigate(`/mission/${p.id}`)}
        >
          <div className="problem-number">문제 {p.id}</div>
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
        </button>
      ))}
    </div>
  );
}
