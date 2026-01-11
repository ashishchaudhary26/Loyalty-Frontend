import React, { useEffect } from "react";
import HeroSection from "../../components/common/HeroSection";
import ProductGrid from "../../components/common/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "../../redux/slices/products/productsSlice";
import "./LandingPage.css";

export default function LandingPage() {
  const dispatch = useDispatch();

  const {
    items = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.products || {});

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <div className="landing-container fade-in">
      <HeroSection />

      <div className="section-wrapper">
        {loading && (
          <div className="loading skeleton-box">Loading products...</div>
        )}

        {error && <p className="error-text">{error}</p>}

        {!loading && items.length === 0 && (
          <p className="empty-state">No products available. Coming soon 🚀</p>
        )}

        {!loading && items.length > 0 && (
          <>
            <ProductGrid title="🔥 Trending Now" products={items.slice(0, 6)} />
            {/* <ProductGrid title="⭐ Top Sellers" products={items.slice(6, 12)} /> */}
          </>
        )}
      </div>
    </div>
  );
}
