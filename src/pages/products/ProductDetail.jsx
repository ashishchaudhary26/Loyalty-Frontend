// src/pages/products/ProductDetail.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductById,
  getProductReviews,
  postReview,
} from "../../api/productApi";
import { addToCart } from "../../redux/slices/cart/cartSlice";
import { cartApi } from "../../api/cartApi";
import { FaStar } from "react-icons/fa";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { productId } = useParams();
  const id = productId;

  const dispatch = useDispatch();

  // ---------- AUTH ----------
  const auth = useSelector((state) => state.auth || {});
  const reduxToken = auth?.token;
  const reduxUser = auth?.user;

  const lsToken = localStorage.getItem("token");
  const lsUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const token = reduxToken || lsToken;
  const user = reduxUser || lsUser;
  const isAuthenticated = !!token;
  // ---------------------------

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewError, setReviewError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 👇 for gallery
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          getProductById(id),
          getProductReviews(id),
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data || []);
        setActiveImageIndex(0);
      } catch (err) {
        console.error("Failed to load product detail", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  // ⭐ compute average rating (from backend or from reviews)
  const { averageRating, totalReviews } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { averageRating: product?.averageRating || null, totalReviews: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = sum / reviews.length;
    return { averageRating: product?.averageRating || avg, totalReviews: reviews.length };
  }, [reviews, product]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to add review.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      setReviewError(null);

      await postReview(id, {
        rating,
        comment,
        userId: user?.id,
      });

      const revRes = await getProductReviews(id);
      setReviews(revRes.data || []);

      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Failed to submit review", err);

      const backend = err.response?.data;
      console.log("🔍 Backend error payload:", backend);

      let message = "Failed to submit review";

      if (backend) {
        if (typeof backend === "string") {
          message = backend;
        } else if (backend.message) {
          message = backend.message;
        } else if (backend.error) {
          message = backend.error;
        } else if (backend.status) {
          message = `Error ${backend.status}`;
        }
      }

      setReviewError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Same add-to-cart behavior as ProductCard
  const handleAddToCart = async () => {
    if (!product) return;

    const isAvailable =
      product.is_available !== undefined ? product.is_available : product.available;

    if (!isAvailable) {
      alert("This product is out of stock.");
      return;
    }

    // 1️⃣ update Redux cart
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

    // 2️⃣ sync with backend cart
    try {
      await cartApi.addItem({
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      });
    } catch (err) {
      console.error(
        "Failed to sync cart with backend from detail page:",
        err?.response?.data || err
      );
    }
  };

  if (loading) return <p className="product-detail-loading">Loading product...</p>;
  if (!product) return <p className="product-detail-loading">Product not found.</p>;

  const images = product.images || [];
  const mainImageUrl =
    images.length > 0
      ? images[activeImageIndex]?.imageUrl || images[0].imageUrl
      : "/placeholder.png";

  const isAvailable =
    product.is_available !== undefined ? product.is_available : product.available;

  const renderStars = (value = 0) => {
    const rounded = Math.round(value);
    return (
      <div className="stars-inline">
        {[1, 2, 3, 4, 5].map((n) => (
          <FaStar
            key={n}
            className={n <= rounded ? "star filled" : "star"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-detail-page">
      {/* Optional: breadcrumb */}
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span className="breadcrumb-current">
          {product.productName || product.name}
        </span>
      </div>

      <div className="product-detail-main">
        {/* LEFT: IMAGES */}
        <div className="product-detail-image">
          <img
            src={mainImageUrl}
            alt={product.productName || "Product"}
            className="product-main-img"
          />

          {images.length > 1 && (
            <div className="product-thumb-row">
              {images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={img.imageUrl}
                  alt={img.altText || `Image ${index + 1}`}
                  className={
                    index === activeImageIndex
                      ? "product-thumb active"
                      : "product-thumb"
                  }
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO */}
        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1>{product.productName || product.name}</h1>

            {averageRating && (
              <div className="product-rating-summary">
                {renderStars(averageRating)}
                <span className="rating-score">
                  {averageRating.toFixed(1)} / 5
                </span>
                <span className="rating-count">
                  ({totalReviews} review{totalReviews === 1 ? "" : "s"})
                </span>
              </div>
            )}
          </div>

          <p className="product-detail-price">₹{product.price}</p>

          <div className="product-meta-row">
            <p
              className={
                isAvailable ? "product-stock" : "product-stock out-of-stock"
              }
            >
              {isAvailable ? "In Stock" : "Out of Stock"}
            </p>
            {product.brandName && (
              <p className="product-meta-pill">Brand: {product.brandName}</p>
            )}
            {product.categoryName && (
              <p className="product-meta-pill">
                Category: {product.categoryName}
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p className="product-short-desc">{product.shortDescription}</p>
          )}
          {product.description && (
            <p className="product-long-desc">{product.description}</p>
          )}

          <div className="product-actions-row">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              Add to Cart
            </button>
            {/* Future: you can add a Buy Now button here */}
            {/* <button className="buy-now-btn">Buy Now</button> */}
          </div>
        </div>
      </div>

      <hr className="product-detail-divider" />

      {/* ⭐ Reviews Section */}
      <div className="product-reviews-section">
        <div className="reviews-header-row">
          <h3>Customer Reviews</h3>
          {averageRating && (
            <div className="reviews-summary">
              {renderStars(averageRating)}
              <span className="rating-score">
                {averageRating.toFixed(1)} / 5
              </span>
              <span className="rating-count">
                • {totalReviews} review{totalReviews === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}

        {reviews.length > 0 && (
          <ul className="reviews-list">
            {reviews.map((r) => (
              <li key={r.id} className="review-item">
                <div className="review-header">
                  <div className="review-stars">
                    {renderStars(r.rating)}
                  </div>
                  {r.reviewTitle && (
                    <span className="review-title">{r.reviewTitle}</span>
                  )}
                </div>
                <p>{r.reviewText}</p>
                {r.createdAt && (
                  <small className="review-date">
                    {new Date(r.createdAt).toLocaleString()}
                  </small>
                )}
              </li>
            ))}
          </ul>
        )}

        {isAuthenticated ? (
          <div className="review-form-wrapper">
            <h4>Write a review</h4>
            {reviewError && <p className="review-error">{reviewError}</p>}

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input-row">
                <span>Your rating:</span>
                <div className="rating-input-stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="rating-star-btn"
                      onClick={() => setRating(n)}
                    >
                      <FaStar
                        className={n <= rating ? "star filled" : "star"}
                      />
                    </button>
                  ))}
                </div>

              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
              />

              <button type="submit" disabled={submitting} className="submit-review-btn">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        ) : (
          <p style={{ marginTop: "1rem" }}>Login to write a review.</p>
        )}
      </div>
    </div>
  );
}
