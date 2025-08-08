import React from "react";
import "./levels.css";

import img1 from "../assets/robot-icon.png";
import img2 from "../assets/robot-icon.png";
import img3 from "../assets/robot-icon.png";
import img4 from "../assets/robot-icon.png";
import img5 from "../assets/robot-icon.png";
import img6 from "../assets/robot-icon.png";

export default function Intermediate() {
  const problems = [
    { id: 7, title: "큰 제목을 화면에 넣어봐요!", image: img1 },
    { id: 8, title: "로그인 화면을 만들어봐요!", image: img2 },
    { id: 9, title: "카카오톡 화면을 만들어봐요!", image: img3 },
    { id: 10, title: "문제 4", image: img4 },
    { id: 11, title: "문제 5", image: img5 },
    { id: 12, title: "문제 6", image: img6 },
  ];
  return (
    <div className="problems-container">
      {problems.map((p) => (
        <div key={p.id} className="problem-card">
         <p>문제 {p.id}</p>
          <img src={p.image} alt={p.title} />
          <h3>{p.title}</h3>
        </div>
      ))}
    </div>
  );
}