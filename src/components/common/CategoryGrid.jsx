// src/components/common/CategoryGrid.jsx
import React from "react";
import { FaTag } from "react-icons/fa";
import "./CategoryGrid.css";

const CategoryGrid = ({
  categories = [],
  title = "Shop by Category",
  onSelect,
}) => {
  return (
    <section className="category-section">
      {title && <h2 className="category-title">{title}</h2>}

      <div className="category-grid">
        {categories.length === 0 ? (
          <p className="no-category">No categories available.</p>
        ) : (
          categories.map((category) => {
            const name = category.categoryName || category.name || "Unnamed";
            const firstLetter = name.charAt(0).toUpperCase();

            return (
              <button
                type="button"
                key={category.id}
                className="category-card"
                onClick={() => onSelect && onSelect(category)}
              >
                <div className="category-icon-wrapper">
                  <div className="category-icon-circle">
                    <FaTag className="category-icon" />
                  </div>
                </div>
                <p className="category-name">{name}</p>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
