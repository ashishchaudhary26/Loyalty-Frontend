// src/pages/checkout/Checkout.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Checkout.css";

import { clearCart } from "../../redux/slices/cart/cartSlice";
import {
  fetchAddresses,
  addAddress,
  deleteAddressThunk,
} from "../../redux/slices/address/addressSlice";

import orderApi from "../../api/orderApi";
import { getProductById } from "../../api/productApi";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state) => state.cart);
  const { addresses = [], loading: addrLoading, error: addrError } =
    useSelector((state) => state.address || {});
  const { user } = useSelector((state) => state.auth);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [productDetails, setProductDetails] = useState({});

  // Payment Popup State
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    mobileNumber: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Load addresses on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto-select first address if none selected
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  // Load product details for items
  useEffect(() => {
    const loadProductDetails = async () => {
      const ids = [...new Set(items.map((i) => i.productId))];
      const result = {};

      for (let id of ids) {
        try {
          const res = await getProductById(id);
          result[id] = res.data;
        } catch (err) {
          console.error("Failed fetching product", id);
        }
      }

      setProductDetails(result);
    };

    if (items?.length > 0) loadProductDetails();
  }, [items]);

  const formatError = (err) => {
    if (!err) return "";
    if (typeof err === "string") return err;
    return err?.message || err?.error || "Unexpected error";
  };

  // PLACE ORDER
  const handlePlaceOrder = async () => {
    if (!items || items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }

    const orderPayload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        productName:
          productDetails[item.productId]?.productName ||
          item.productName ||
          `Product #${item.productId}`,
      })),
      shippingAddressId: selectedAddressId,
      cartUuid: localStorage.getItem("cart_uuid") || null,
    };

    try {
      setPlacing(true);
      setOrderError(null);

      const res = await orderApi.createOrder(orderPayload);
      const createdOrder = res.data;

      const payRes = await orderApi.initiatePayment({
        orderId: createdOrder.id,
        provider: "FAKE",
        amount: createdOrder.totalAmount,
      });

      console.log("Payment initiated:", payRes.data);

      await dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Failed to place order:", err);
      setOrderError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to place order"
      );
    } finally {
      setPlacing(false);
    }
  };

  // Open payment popup
  const openPaymentPopup = () => {
    if (!items?.length) return alert("Your cart is empty.");
    if (!selectedAddressId) return alert("Select an address.");
    setShowPaymentPopup(true);
  };

  // Confirm payment → actually place order
  const confirmPayment = () => {
    setShowPaymentPopup(false);
    handlePlaceOrder();
  };

  // New address handlers
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    if (!newAddress.fullName || !newAddress.addressLine || !newAddress.city) {
      alert("Please fill at least name, address and city.");
      return;
    }

    try {
      const action = await dispatch(addAddress(newAddress));
      if (addAddress.fulfilled.match(action)) {
        const added = action.payload;
        setSelectedAddressId(added.id);
        setNewAddress({
          fullName: "",
          mobileNumber: "",
          addressLine: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
        setShowAddressModal(false);
      }
    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  const handleDeleteAddress = (id) => {
    if (!window.confirm("Delete this address?")) return;
    dispatch(deleteAddressThunk(id)).then(() => {
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }
    });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* ===== PAYMENT POPUP ===== */}
      {showPaymentPopup && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h3>Confirm Payment</h3>
            <p>
              Amount to Pay: <strong>₹{totalAmount?.toFixed(2)}</strong>
            </p>

            <button className="confirm-btn" onClick={confirmPayment}>
              Confirm & Pay
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowPaymentPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== ADDRESS MODAL (Add New Address) ===== */}
      {showAddressModal && (
        <div className="payment-modal-overlay">
          <div className="address-modal">
            <div className="address-modal-header">
              <h3>Add New Address</h3>
              <button
                type="button"
                className="address-modal-close"
                onClick={() => setShowAddressModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="address-modal-form">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={newAddress.fullName}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={newAddress.mobileNumber}
                onChange={handleAddressChange}
              />
              <textarea
                name="addressLine"
                placeholder="Address Line"
                value={newAddress.addressLine}
                onChange={handleAddressChange}
              />
              <div className="address-modal-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="address-modal-row">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={handleAddressChange}
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="address-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="add-address-btn">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MAIN CONTENT (STACKED) ===== */}
      <div className="checkout-content">
        {/* Shipping Section */}
        <section className="checkout-section">
          <div className="checkout-section-header">
            <h3>Shipping Address</h3>
            <button
              type="button"
              className="add-address-trigger"
              onClick={() => setShowAddressModal(true)}
            >
              + Add New Address
            </button>
          </div>

          {addrLoading && <p className="checkout-text">Loading addresses...</p>}
          {addrError && (
            <p className="checkout-text error-text">
              {formatError(addrError) || "Failed to load addresses"}
            </p>
          )}

          {addresses && addresses.length > 0 ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  <label className="address-radio">
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <div>
                      <strong>{addr.fullName}</strong>
                      {addr.mobileNumber && (
                        <div className="address-line">
                          {addr.mobileNumber}
                        </div>
                      )}
                      <div className="address-line">{addr.addressLine}</div>
                      <div className="address-line">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                      <div className="address-line">{addr.country}</div>
                    </div>
                  </label>
                  <button
                    className="address-delete-btn"
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="checkout-text">
              No saved addresses yet. Click &ldquo;Add New Address&rdquo; to
              create one.
            </p>
          )}
        </section>

        {/* Order Summary Section */}
        <section className="checkout-section">
          <h3>Order Summary</h3>

          {items &&
            items.length > 0 &&
            items.map((item) => {
              const product = productDetails[item.productId];
              return (
                <div key={item.id} className="checkout-item">
                  <div>
                    <p className="checkout-item-title">
                      {product?.productName ||
                        product?.name ||
                        item.productName ||
                        `Product #${item.productId}`}
                    </p>
                    <small>Qty: {item.quantity}</small>
                  </div>
                  <strong>
                    ₹{((item.unitPrice || 0) * item.quantity).toFixed(2)}
                  </strong>
                </div>
              );
            })}

          <hr className="checkout-divider" />

          <div className="checkout-total">
            <span>Total:</span>
            <strong>₹{totalAmount?.toFixed(2) || "0.00"}</strong>
          </div>

          {orderError && (
            <p className="checkout-text error-text">
              {formatError(orderError)}
            </p>
          )}

          <button
            className="place-order-btn"
            disabled={placing || !items?.length || !selectedAddressId}
            onClick={openPaymentPopup}
          >
            {placing ? "Processing..." : "Make Payment"}
          </button>
        </section>
      </div>
    </div>
  );
}
