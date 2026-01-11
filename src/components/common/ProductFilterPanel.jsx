import React, { useState, useEffect } from "react";
import "./ProductFilterPanel.css";

const ProductFilterPanel = ({
  categories = [],
  onFilterChange,
  onSortChange,
  initialFilters = {
    categories: [],
    price: { min: 0, max: 10000 },
    sortBy: "",
  },
}) => {
  const [selectedCategories, setSelectedCategories] = useState(
    initialFilters.categories || []
  );
  const [priceRange, setPriceRange] = useState(
    initialFilters.price || { min: 0, max: 10000 }
  );
  const [sortBy, setSortByState] = useState(initialFilters.sortBy || "");

  // 🔹 Notify parent when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        price: priceRange,
      });
    }
    // ❗ Do NOT include onFilterChange in deps to avoid infinite loop
  }, [selectedCategories, priceRange]);

  // 🔹 Notify parent when sort changes
  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortBy);
    }
    // ❗ Do NOT include onSortChange in deps
  }, [sortBy]);

  const toggleCategory = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  return (
    <aside className="filter-panel">
      <div className="filter-section">
        <h4>Categories</h4>
        <div className="category-list">
          {categories.map((cat) => {
            const name = cat.categoryName || cat.name;
            return (
              <button
                key={cat.id}
                className={`category-btn ${
                  selectedCategories.includes(name) ? "active" : ""
                }`}
                onClick={() => toggleCategory(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-section">
        <h4>Price Range (₹)</h4>
        <div className="price-inputs">
          <input
            type="number"
            name="min"
            value={priceRange.min}
            min={0}
            placeholder="Min"
            onChange={handlePriceChange}
          />
          <span>-</span>
          <input
            type="number"
            name="max"
            value={priceRange.max}
            placeholder="Max"
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortByState(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="price_low_high">Price: Low → High</option>
          <option value="price_high_low">Price: High → Low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilterPanel;
