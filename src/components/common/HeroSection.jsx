// src/components/common/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Shop Smarter,
          <br /> Live Better.
        </h1>
        <p>
          Unlock exclusive deals, rewards, and premium product experiences — all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="btn-primary">
            Shop Now
          </Link>
          <Link to="/categories" className="btn-outline">
            Explore Categories
          </Link>
        </div>
      </div>

      
    </section>
  );
}
