import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PROBLEM_BY_ID } from "../data/problems";
import { htmlFromLocal, gradeHtml } from "../utils/grader";

export default function MissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEM_BY_ID[id];

  if (!problem) return <div>존재하지 않는 문제입니다. (id={id})</div>;

  const [grade, setGrade] = React.useState(null);
  const handleGrade = () => {
    const html = htmlFromLocal();
    const res = gradeHtml(html, problem.rules || {});
    setGrade(res);
  };

  return (
    <div style={{ padding:20, borderRadius:12, background:"#fff" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
        <div className="app-tab-btn active" style={{ borderBottomLeftRadius:10, borderBottomRightRadius:10 }}>
          나의 미션 — “{problem.title}”
        </div>
        <button className="app-tab-btn" onClick={() => navigate(-1)}>문제 목록으로</button>
      </div>

      <div style={{ display:"flex", gap:24, alignItems:"center" }}>
        <img src={problem.image} alt={problem.title}
             style={{ width:240, borderRadius:12, border:"1px solid #DEF3FF", boxShadow:"0 6px 18px rgba(0,0,0,0.12)" }}/>
        <div>
          <h2 style={{ marginBottom:8 }}>문제 {id}</h2>
          <p style={{ fontWeight:600 }}>{problem.title}</p>
          <p style={{ marginTop:8, color:"#4b5563" }}>우측 블록을 조립해 상단 “나의 화면”과 같이 만들면 성공!</p>
        </div>
      
      <div style={{ marginTop:16, padding:12, borderTop:"1px dashed #cbd5e1" }}>
        <button className="app-tab-btn" onClick={handleGrade}>채점하기</button>
        {grade && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontWeight:700, marginBottom:6 }}>점수: {grade.score} / {grade.total}</div>
            <ul style={{ lineHeight:1.7 }}>
              {grade.checks.map((c, idx) => (
                <li key={idx}>{c.pass ? '✅' : '❌'} [{c.type}] {c.target}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

