import React, { useEffect } from "react";
import "./MainPage.css";
import logo from "../assets/blocky-logo.png";

export default function MainPage() {
  useEffect(() => {
    // 페이드업 효과
    const elements = document.querySelectorAll(".fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );
    elements.forEach((el) => observer.observe(el));

    // 패럴랙스 이미지 효과
    const handleScroll = () => {
      const images = document.querySelectorAll(".parallax-img");
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const scrollPercent = Math.min(Math.max((window.innerHeight - rect.top) / window.innerHeight, 0), 1);
        img.style.transform = `scale(${1 + scrollPercent * 0.1})`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="scroll-container">
      {/* Section 1 */}
      <section className="section">
        <div className="main-box">
          <div className="main-title-text fade-up">
            웹 개발, 더 쉽고 빠르게<br />누구나 시작할 수 있도록
          </div>
          <div className="main-sub-text fade-up">
            BLOCKY는 복잡한 코드를 몰라도<br />
            직관적으로 웹을 만들고 결과를 바로 확인할 수 있는<br />
            새로운 학습 플랫폼입니다.
          </div>
          <img className="main-image fade-up parallax-img" src={logo} alt="Blocky logo" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="section dark">
        <div className="main-box">
          <div className="main-highlight-text fade-up">
            📦 드래그 & 드롭으로<br />웹 페이지 완성
          </div>
          <div className="main-sub-text fade-up">
            블록을 조립하듯 끌어서 놓기만 하면<br />
            페이지 구조가 완성됩니다.
          </div>
          <img
            className="main-image fade-up parallax-img"
            src=".png"
            alt="Blocks example"
          />
        </div>
      </section>

      {/* Section 3 */}
      <section className="section">
        <div className="main-box">
          <div className="main-highlight-text fade-up">
           ⚡ 실시간 코드 생성
          </div>
          <div className="main-sub-text fade-up">
            블록을 쌓는 즉시 HTML/CSS 코드가 생성되어<br />
            결과를 바로 보면서 배우실 수 있습니다.
          </div>
          <div className="main-card-container">
            <div className="main-card fade-up" style={{ transitionDelay: "0.1s" }}>
              구조는 ‘화면’ 블록으로
            </div>
            <div className="main-card fade-up" style={{ transitionDelay: "0.2s" }}>
              꾸미기는 ‘스타일’ 블록으로
            </div>
            <div className="main-card fade-up" style={{ transitionDelay: "0.3s" }}>
              간단히 블록을 조립하면 완성!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}