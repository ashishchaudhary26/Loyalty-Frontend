import React from "react";
import "./ProductGrid.css";
import ProductCard from "../Cards/ProductCard";

const ProductGrid = ({ products = [], title = "Products" }) => {
  return (
    
    <section className="product-grid-section">
      {title && <h2 className="product-grid-title">{title}</h2>}

      {products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
