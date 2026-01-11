// src/pages/orders/Orders.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Orders.css";
import { loadOrders } from "../../redux/slices/orders/orderSlice";
import { getProductById } from "../../api/productApi";

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  // productId -> { name, price }
  const [productMap, setProductMap] = useState({});
  const [productError, setProductError] = useState(null);

  useEffect(() => {
    dispatch(loadOrders());
  }, [dispatch]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const allIds = new Set();
    orders.forEach((order) => {
      (order.items || []).forEach((it) => {
        if (it.productId) allIds.add(it.productId);
      });
    });

    const missingIds = Array.from(allIds).filter((id) => !productMap[id]);
    if (missingIds.length === 0) return;

    (async () => {
      try {
        const results = await Promise.all(
          missingIds.map((id) => getProductById(id))
        );

        const update = {};
        missingIds.forEach((id, index) => {
          const p = results[index].data;
          update[id] = {
            name: p.productName || p.name || `Product #${id}`,
            price: p.price ?? p.unitPrice ?? 0,
          };
        });

        setProductMap((prev) => ({ ...prev, ...update }));
      } catch (err) {
        console.error("Failed to load product details for orders", err);
        setProductError("Some product details could not be loaded.");
      }
    })();
  }, [orders, productMap]);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header-row">
          <h2 className="orders-title">My Orders</h2>
          <Link to="/products" className="orders-back-link">
            ← Back to Products
          </Link>
        </div>
        <p className="orders-message">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="orders-header-row">
          <h2 className="orders-title">My Orders</h2>
          <Link to="/products" className="orders-back-link">
            ← Back to Products
          </Link>
        </div>
        <p className="orders-message error-text">Error: {error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="orders-header-row">
          <h2 className="orders-title">My Orders</h2>
          <Link to="/products" className="orders-back-link">
            ← Back to Products
          </Link>
        </div>
        <div className="orders-empty-box">
          <p className="orders-message">You have no orders yet.</p>
          <Link to="/products" className="orders-empty-link">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header-row">
        <h2 className="orders-title">My Orders</h2>
        <Link to="/products" className="orders-back-link">
          ← Back to Products
        </Link>
      </div>

      {productError && (
        <p className="orders-message warning-text">{productError}</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.orderNumber} className="order-card">
            {/* Top row: order number + status + date */}
            <div className="order-header">
              <div className="order-header-main">
                <span className="order-number">
                  <span className="order-label">Order</span> #{order.orderNumber}
                </span>
                {order.createdAt && (
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <span
                className={`order-status-badge status-${
                  order.orderStatus?.toLowerCase?.() || "default"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* 🔹 Items block with subtle background & header */}
            <div className="order-items-block">
              <div className="order-items-header">
                <span>Items</span>
                <span>Amount</span>
              </div>

              <div className="order-items">
                {order.items?.map((item, idx) => {
                  const info = productMap[item.productId] || {};
                  const displayName =
                    info.name ||
                    item.productName ||
                    `Product #${item.productId}`;

                  const unitPrice = info.price ?? item.unitPrice ?? 0;
                  const lineTotal =
                    Number(unitPrice || 0) * (item.quantity || 0);

                  return (
                    <div key={idx} className="order-item">
                      <div className="order-item-info">
                        <p className="order-item-title">{displayName}</p>
                        <p className="order-item-meta">
                          ₹{unitPrice.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="order-item-amount-block">
                        <span className="order-item-amount-label">
                          Item total
                        </span>
                        <strong className="order-item-amount">
                          ₹{lineTotal.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer total */}
            <div className="order-footer">
              <div className="order-total">
                <span>Order Total</span>
                <strong>
                  ₹{Number(order.totalAmount || 0).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
