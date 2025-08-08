import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import "./MainPage.css";
import logo from "../assets/blocky-logo.png";
import NavBar from "../components/NavBar";

const blockyLetters = ["B", "L", "O", "C", "K", "Y"];
const blockyConfigs = [
  { border: "#e05555", font: "#b92424", shadow: "#fa8a8a80" }, 
  { border: "#f4be4f", font: "#b4850d", shadow: "#f9e48b80" }, 
  { border: "#4296d6", font: "#204775", shadow: "#9ccbf580" }, 
  { border: "#62b769", font: "#2a7a33", shadow: "#b3e5bb80" }, 
  { border: "#d16fad", font: "#861b5c", shadow: "#edacec80" }, 
  { border: "#e59033", font: "#915208", shadow: "#f5cd8d80" }, 
];

export default function MainPage() {
  const [fall, setFall] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.16 }
    );
    elements.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", () => {
      const images = document.querySelectorAll(".parallax-img");
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const scrollPercent = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
        img.style.transform = `scale(${1 + scrollPercent * 0.07})`;
      });
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="scroll-container">
      <NavBar />

      {/* 1: BLOCKY 블록 무너지고 드래그 */}
      <section
        className="section blocks-bg"
        onMouseEnter={() => setFall(true)}
        onMouseLeave={() => setFall(false)}
        style={{ userSelect: "none" }}
      >
        <div className="main-box">
          <div className="main-highlight-text fade-up" style={{ fontSize: "2.3rem" }}>
            BLOCKY를 직접 만져보세요!
          </div>
          <div className="main-sub-text fade-up" style={{ marginBottom: "2.6rem" }}>
            <b>웹 프론트엔드, 어렵고 복잡하게 느끼셨나요?</b><br />
            HTML, CSS, 낯설고 머릿속에 잘 안 들어오셨나요?<br /><br />
            그래서 BLOCKY가 만들었습니다.<br />
            블록을 쌓듯 쉽고 재미있게,  
            <span style={{ color: "#43c6ac", fontWeight: "700" }}>웹 프론트엔드의 모든 것</span>을 배워보세요!
          </div>
          <div className="falling-blocks-row" style={{ marginBottom: "1.7rem" }}>
            {blockyLetters.map((char, idx) => (
              <motion.div
                key={char + idx}
                className="falling-block blocky-wood"
                drag={fall}
                dragElastic={0.6}
                dragMomentum={false}
                dragConstraints={{ top: 0, bottom: 140, left: -120, right: 120 }}
                animate={
                  fall
                    ? {
                        y: 120,
                        rotate: (Math.random() - 0.5) * 70,
                        boxShadow: `0 10px 32px 0 ${blockyConfigs[idx].shadow}`,
                        transition: {
                          type: "spring",
                          stiffness: 330,
                          damping: 15,
                          delay: idx * 0.07,
                        }
                      }
                    : {
                        y: 0,
                        rotate: 0,
                        boxShadow: `0 4px 18px 0 ${blockyConfigs[idx].shadow}`,
                        transition: {
                          type: "spring",
                          stiffness: 130,
                          damping: 15,
                          delay: idx * 0.02,
                        }
                      }
                }
                style={{
                  "--blocky-border": blockyConfigs[idx].border,
                  "--blocky-font": blockyConfigs[idx].font,
                  "--blocky-shadow": blockyConfigs[idx].shadow,
                  fontFamily: "'Lora', 'Roboto Slab', 'Times New Roman', serif",
                }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2: 카드형 기능 소개 */}
      <section className="section section-hero">
        <div className="main-box">
          <div className="main-highlight-text fade-up" style={{ fontSize: "2.15rem" }}>
            <span style={{
              background: "linear-gradient(90deg, #43c6ac, #9f77fa 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "900"
            }}>실시간 웹 제작,</span>
            <br />더 직관적이고, 더 창의적으로.
          </div>
          <div className="main-sub-text fade-up" style={{ color: "#464866", fontSize: "1.19rem", marginBottom: "2.2rem" }}>
            블록을 쌓는 즉시 <b>코드와 결과</b>가 한눈에!<br />
            코딩의 벽 없이 바로 배우고, 바로 응용할 수 있습니다.
          </div>
          <div className="main-card-container">
            <Tilt tiltMaxAngleX={17} tiltMaxAngleY={17} glareEnable={true} glareColor="#b4e2ff" glareMaxOpacity={0.16} style={{ margin: 0 }}>
              <div className="main-card fade-up" style={{ transitionDelay: "0.07s" }}>
                <span className="emoji">⚡</span> 블록을 조립하면 코드가 실시간 생성!
              </div>
            </Tilt>
            <Tilt tiltMaxAngleX={17} tiltMaxAngleY={17} glareEnable={true} glareColor="#ffdaee" glareMaxOpacity={0.15} style={{ margin: 0 }}>
              <div className="main-card fade-up" style={{ transitionDelay: "0.14s" }}>
                <span className="emoji">👁️</span> 결과 미리보기로 즉시 확인!
              </div>
            </Tilt>
            <Tilt tiltMaxAngleX={17} tiltMaxAngleY={17} glareEnable={true} glareColor="#ffe6be" glareMaxOpacity={0.15} style={{ margin: 0 }}>
              <div className="main-card fade-up" style={{ transitionDelay: "0.21s" }}>
                <span className="emoji">🎨</span> 다양한 스타일과 자유로운 커스터마이즈!
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* 3: 마지막+ 로고 */}
      <section className="section fancy-gradient">
        <div className="main-box">
          <motion.div
            className="main-title-text innovative-title"
            style={{ fontSize: "4.8rem" }}
            initial={false}
            animate={false}
          >
          </motion.div>
          <div className="main-sub-text fade-up" style={{ fontSize: "1.28rem", marginTop: "1.2rem" }}>
            <b>웹 개발의 새로운 시작, BLOCKY에서!</b><br />
            지금 바로 쉽고, 빠르고, 재밌게 만들어보세요.
          </div>
          <img
            className="main-image fade-up parallax-img glow"
            src={logo}
            alt="Blocky logo"
            style={{
              background: "none",
              boxShadow: "none",
              borderRadius: "0.6rem",
              width: "440px",
              margin: "2.5rem auto 2.5rem"
            }}
          />
          <button className="main-action-btn fade-up shiny-btn">지금 체험해보기</button>
        </div>
      </section>
    </div>
  );
}
