import React from "react";
import "./FeatureIcons.css";
import { FaShippingFast, FaHeadphones, FaShieldAlt, FaCreditCard } from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaShippingFast />,
    title: "Fast Delivery",
    subtitle: "Get orders in 2-4 days",
  },
  {
    id: 2,
    icon: <FaShieldAlt />,
    title: "Secure Payments",
    subtitle: "Your data is encrypted",
  },
  {
    id: 3,
    icon: <FaCreditCard />,
    title: "Easy Returns",
    subtitle: "7-day hassle-free returns",
  },
  {
    id: 4,
    icon: <FaHeadphones />,
    title: "24/7 Support",
    subtitle: "We’re here to help",
  },
];

const FeatureIcons = () => {
  return (
    <div className="feature-section">
      {features.map((feature) => (
        <div className="feature-card" key={feature.id}>
          <div className="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureIcons;
