import React, { useState, useEffect } from "react";
import "./HeroCarousel.css";

const HeroCarousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="carousel-container">

      {/* Slides */}
      <div
        className="carousel-slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="carousel-slide" key={index}>
            <img src={slide.image} alt={slide.title || "Slide"} />

            {/* Text Overlay */}
            {slide.title && (
              <div className="carousel-text">
                <h2>{slide.title}</h2>
                {slide.subtitle && <p>{slide.subtitle}</p>}
                {slide.cta && <button onClick={slide.onClick}>{slide.cta}</button>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`indicator ${i === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(i)}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default HeroCarousel;
