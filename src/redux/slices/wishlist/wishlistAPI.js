// Temporary mock — replace with real backend later
export const getWishlistAPI = async () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const addWishlistAPI = async (productId) => {
  return true;
};

export const removeWishlistAPI = async (productId) => {
  return true;
};
