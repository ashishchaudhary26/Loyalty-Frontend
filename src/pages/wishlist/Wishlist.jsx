import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Wishlist.css";
import { removeFromWishlist } from "../../redux/slices/wishlist/wishlistSlice";
import { addToCart } from "../../redux/slices/cart/cartSlice";
import { Link } from "react-router-dom";

export default function Wishlist() {
  
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.productId));
  };

  return (
    <div className="wishlist-container">
      <h2>❤️ My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p className="empty-msg">
          Your wishlist is empty 🥲 — <Link to="/products">Browse items</Link>
        </p>
      ) : (
        <div className="wishlist-grid">

          {wishlistItems.map((item) => (
            <div key={item.productId} className="wishlist-card">
              
              <Link to={`/products/${item.productId}`}>
                <img src={item.image} alt={item.title} />
              </Link>

              <h3>{item.title}</h3>

              <p className="price">₹{item.price}</p>

              <div className="wishlist-buttons">
                <button className="add-cart" onClick={() => handleMoveToCart(item)}>
                  Move to Cart 🛍️
                </button>

                <button 
                  className="remove-btn"
                  onClick={() => dispatch(removeFromWishlist(item.productId))}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
