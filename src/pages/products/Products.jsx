// src/pages/products/Products.jsx
import React, { useState, useEffect } from "react";

import ProductCard from "../../components/Cards/ProductCard";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import { useSearchParams } from "react-router-dom";
import "./Products.css";

import {
  getProducts,
  searchProducts,
  getCategories,
  getBrands,
} from "../../api/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchParams] = useSearchParams();
  // 🔹 Read categoryId from URL and apply as filter
  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoryId");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setCurrentPage(1);
    }
    // (Optional: you could also support ?q= for search later)
  }, [searchParams]);

  const pageSize = 12; // `size` param

  // 🔹 Load categories & brands once
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };
    loadFilters();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage - 1, // backend is 0-based
        size: pageSize,
      };

      const isSearchMode =
        (searchQuery && searchQuery.trim() !== "") ||
        selectedCategory ||
        selectedBrand;

      let res;

      if (isSearchMode) {
        const searchParams = {
          ...params,
          keyword: searchQuery || undefined,
          categoryId: selectedCategory || undefined,
          brandId: selectedBrand || undefined,
        };

        console.log("🔍 Fetching via /search with params:", searchParams);
        res = await searchProducts(searchParams);
      } else {
        console.log("📦 Fetching all products via /api/v1/products", params);
        res = await getProducts(params);
      }

      const data = res.data;
      const items = Array.isArray(data) ? data : data.content || [];

      setProducts(items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, selectedCategory, selectedBrand]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="products-page">
        {/* ===== Header: title + search + filters ===== */}
        <header className="products-header">
          <div className="products-header-left">
            <h1>All Products</h1>
            <p className="products-subtitle">
              Browse and discover items you’ll love.
            </p>
          </div>

          <div className="products-header-right">
            <div className="products-search">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>

            <div className="products-filters">
              <div className="filter-group">
                <label htmlFor="categoryFilter">Category</label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="brandFilter">Brand</label>
                <select
                  id="brandFilter"
                  value={selectedBrand}
                  onChange={handleBrandChange}
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brandName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* ===== Body ===== */}
        <div className="products-body">
          <div className="products-grid">
            {loading && <p className="products-message">Loading products...</p>}

            {error && (
              <p className="products-message error-text">
                {error}
              </p>
            )}

            {!loading && !error && products.length === 0 && (
              <p className="products-message">
                {searchQuery || selectedBrand || selectedCategory
                  ? "No products found with current filters."
                  : "No products found."}
              </p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="products-grid-inner">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </div>
      </div>

     
    </>
  );
};

export default Products;
