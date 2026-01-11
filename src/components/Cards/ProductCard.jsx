// src/components/Cards/ProductCard.jsx
import React, { useEffect, useState, useMemo } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlist/wishlistSlice";
import { addToCart } from "../../redux/slices/cart/cartSlice";
import { cartApi } from "../../api/cartApi";
import { getProductReviews } from "../../api/productApi";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  // 🔹 load reviews for this product and compute avg + count
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        if (!product?.id) return;
        const res = await getProductReviews(product.id);
        if (!isMounted) return;
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews for card:", err);
        if (!isMounted) return;
        setReviews([]);
      } finally {
        if (isMounted) setReviewsLoaded(true);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [product?.id]);

  const { averageRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0) return { averageRating: null, totalReviews: 0 };
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = sum / reviews.length;
    return { averageRating: avg, totalReviews: reviews.length };
  }, [reviews]);

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = async () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.productName || product.name,
        price: product.price,
        image:
          product.images && product.images.length > 0
            ? product.images[0].imageUrl || product.images[0]
            : "/placeholder.png",
        quantity: 1,
      })
    );

    try {
      await cartApi.addItem({
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      });
    } catch (err) {
      console.error(
        "Failed to sync cart with backend:",
        err?.response?.data || err
      );
    }
  };

  const isAvailable =
    product.is_available !== undefined ? product.is_available : product.available;

  const hasRating = averageRating !== null && !Number.isNaN(averageRating);

  const renderStars = (value = 0) => {
    const rounded = Math.round(value);
    return (
      <div className="card-stars-inline">
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            className={n <= rounded ? "card-star filled" : "card-star"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <div
        className="image-container"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0].imageUrl || product.images[0]
              : "/placeholder.png"
          }
          alt={product.productName || product.name || "Unnamed Product"}
        />

        <button
          className="wishlist-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
        >
          {isWishlisted ? (
            <FaHeart className="wish-active" />
          ) : (
            <FaRegHeart />
          )}
        </button>
      </div>

      <div className="product-content">
        <h4 className="product-name">
          {product.productName || product.name || "Unnamed Product"}
        </h4>

        {/* ⭐ Rating row (only if we have reviews) */}
        {reviewsLoaded && hasRating && (
          <div className="card-rating-row">
            {renderStars(averageRating)}
            <span className="card-rating-score">
              {averageRating.toFixed(1)}
            </span>
            {totalReviews > 0 && (
              <span className="card-rating-count">
                ({totalReviews})
              </span>
            )}
          </div>
        )}

        <div className="price-section">
          <span className="price">₹{product.price || "0"}</span>
        </div>

        <p className={isAvailable ? "stock" : "stock out-of-stock"}>
          {isAvailable ? "In Stock" : "Out of Stock"}
        </p>

        <button
          className="cart-btn"
          onClick={handleAddToCart}
          disabled={!isAvailable}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
