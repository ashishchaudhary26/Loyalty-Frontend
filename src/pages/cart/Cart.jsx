// src/pages/cart/Cart.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../redux/slices/cart/cartSlice";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/productApi"; // ✅ use existing API

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount, loading, error } = useSelector(
    (state) => state.cart
  );

  // 🔹 cache of product details keyed by productId
  const [productDetails, setProductDetails] = useState({}); // { [productId]: product }

  // Load cart items from backend
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // When cart items change, fetch product details (name, image, etc.)
  useEffect(() => {
    if (!items || items.length === 0) return;

    const missingIds = items
      .map((item) => item.productId)
      .filter((id) => id && !productDetails[id]);

    if (missingIds.length === 0) return;

    (async () => {
      try {
        const results = await Promise.all(
          missingIds.map((id) => getProductById(id))
        );

        setProductDetails((prev) => {
          const next = { ...prev };
          results.forEach((res, index) => {
            const id = missingIds[index];
            next[id] = res.data; // API returns product object
          });
          return next;
        });
      } catch (err) {
        console.error("Failed to load product details for cart:", err);
      }
    })();
  }, [items, productDetails]);

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      dispatch(removeCartItem(item.id));
    } else {
      dispatch(
        updateCartItem({
          itemId: item.id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleIncrease = (item) => {
    dispatch(
      updateCartItem({
        itemId: item.id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleRemove = (item) => {
    dispatch(removeCartItem(item.id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (loading && items.length === 0) {
    return <p className="cart-container">Loading cart...</p>;
  }

  if (error) {
    return <p className="cart-container">Error: {error}</p>;
  }

  if (!items || items.length === 0) {
  return (
    <div className="cart-container">
      <div className="cart-empty-box">
        <h2 className="cart-title">Your Cart</h2>
        <p className="cart-empty">Your cart is empty.</p>

        <Link to="/products" className="cart-empty-link">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}


  return (
  <div className="cart-container">
    <div className="cart-header-row">
      <h2 className="cart-title">Shopping Cart</h2>

      <Link to="/products" className="cart-continue-link">
        ← Back to Products
      </Link>
    </div>

    <div className="cart-layout">
      {/* LEFT: Items list */}
      <div className="cart-items-column">
        {items.map((item) => {
          const product = productDetails[item.productId];

          const title =
            product?.productName ||
            product?.name ||
            `Product #${item.productId}`;

          const image =
            product?.images?.[0]?.imageUrl ||
            product?.images?.[0] ||
            "/placeholder.png";

          const price = item.unitPrice ?? product?.price ?? 0;

          return (
            <div key={item.id} className="cart-item">
              <div className="cart-item-left">
                <img
                  src={image}
                  alt={title}
                  className="cart-item-img"
                />
                <div>
                  <p className="cart-item-title">{title}</p>
                  <p className="cart-item-price">₹ {price}</p>
                </div>
              </div>

              <div className="qty-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleDecrease(item)}
                >
                  −
                </button>
                <span className="qty-number">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleIncrease(item)}
                >
                  +
                </button>
              </div>

              <div className="cart-actions">
                <p
                  className="remove-btn"
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="summary-box">
        <h3 className="summary-title">Order Summary</h3>

        <div className="summary-total">
          <span>Total Amount</span>
          <strong>₹ {totalAmount.toFixed(2)}</strong>
        </div>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>

        <button className="clear-cart-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </aside>
    </div>
  </div>
);


}
