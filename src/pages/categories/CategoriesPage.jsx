// src/pages/categories/CategoriesPage.jsx 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryGrid from "../../components/common/CategoryGrid";
import Footer from "../../components/Footer/Footer";
import { getCategories } from "../../api/productApi";
import "./CategoriesPage.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getCategories();
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    const id = category.id;
    if (!id) return;

    // ✅ just set query param – Products page will read this and use filter
    navigate(`/products?categoryId=${encodeURIComponent(id)}`);
  };

  return (
    <>
      <div className="categories-page">
        <header className="categories-header">
          <div>
            <h1>Categories</h1>
            <p className="categories-subtitle">
              Shop by category and find what fits your needs.
            </p>
          </div>
        </header>

        <CategoryGrid
          categories={categories}
          title="Shop by Category"
          onSelect={handleCategorySelect}
        />

        {loading && (
          <p className="categories-message">Loading categories...</p>
        )}
        {error && (
          <p className="categories-message error-text">{error}</p>
        )}
      </div>
    </>
  );
};

export default CategoriesPage;
