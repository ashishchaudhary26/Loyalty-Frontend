import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlist/wishlistSlice";
import "./WishlistButton.css";

const WishlistButton = ({ product }) => {
  const dispatch = useDispatch();

  const wishlistItems =
    useSelector((state) => state.wishlist?.items) || [];

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const handleClick = (e) => {
    e.stopPropagation(); // prevent parent click events
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <button className="wishlist-btn" onClick={handleClick}>
      {isWishlisted ? (
        <FaHeart className="wish-active" />
      ) : (
        <FaRegHeart />
      )}
    </button>
  );
};

export default WishlistButton;
