// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import "./Admin.css";
import "./AdminProducts.css";
import { adminApi } from "../../api/adminApi";
import { getCategories, getBrands } from "../../api/productApi";
import Modal from "./Modal";

const PAGE_SIZE = 20;

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = "dtv5uwhlt";
const CLOUDINARY_UPLOAD_PRESET = "my-preset";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const emptyForm = {
  sku: "",
  productName: "",
  shortDescription: "",
  description: "",
  price: "",
  isAvailable: true,
  brandId: "",
  categoryId: "",
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stockSaving, setStockSaving] = useState(false);
  const [metaSaving, setMetaSaving] = useState(false);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);

  const [stockProductId, setStockProductId] = useState(null);
  const [stockQuantity, setStockQuantity] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");

  const [images, setImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageSortOrder, setImageSortOrder] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  // Load categories & brands
  const loadFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()]);

      const catData = Array.isArray(catRes.data) ? catRes.data : JSON.parse(catRes.data);
      const brandData = Array.isArray(brandRes.data) ? brandRes.data : JSON.parse(brandRes.data);

      setCategories(catData || []);
      setBrands(brandData || []);
    } catch (err) {
      console.error("Failed to load brands/categories", err);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  // Load products page
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await adminApi.getProducts({
        page: page - 1,
        size: PAGE_SIZE,
      });

      const data = res.data;
      const items = Array.isArray(data) ? data : data.content || [];

      setProducts(items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open modal for create product
  const startCreate = () => {
    setEditingProductId(null);
    setFormData(emptyForm);
    setImages([]);
    setError(null);
    setModalOpen(true);
  };

  // Open modal for editing product and load details
  const startEdit = async (product) => {
    try {
      setSaving(false);
      setError(null);
      setEditingProductId(product.id);
      setModalOpen(true);

      const res = await adminApi.getProductById(product.id);
      const p = res.data;

      setFormData({
        sku: p.sku || "",
        productName: p.productName || "",
        shortDescription: p.shortDescription || "",
        description: p.description || "",
        price: p.price || "",
        isAvailable: p.available ?? true,
        brandId: p.brandId || "",
        categoryId: p.categoryId || "",
      });

      setImages(p.images || []);
    } catch (err) {
      console.error("Failed to load product details", err);
      setError("Failed to load product details");
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sku: formData.sku,
      productName: formData.productName,
      shortDescription: formData.shortDescription,
      description: formData.description,
      price: formData.price ? Number(formData.price) : 0,
      isAvailable: formData.isAvailable,
      brandId: formData.brandId ? Number(formData.brandId) : null,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
    };

    try {
      setSaving(true);
      setError(null);

      if (editingProductId) {
        await adminApi.updateProduct(editingProductId, payload);
      } else {
        const res = await adminApi.createProduct(payload);
        const created = res.data;
        setEditingProductId(created.id);
      }

      await loadProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to save product: ${backend}`);
      throw err; // rethrow for modal submit handler to detect
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setError(null);
      await adminApi.deleteProduct(id);
      await loadProducts();

      if (editingProductId === id) {
        setEditingProductId(null);
        setFormData(emptyForm);
        setImages([]);
      }
    } catch (err) {
      console.error("Failed to delete product", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to delete product: ${backend}`);
    }
  };

  // Open stock modal
  const openStockModal = (product) => {
    setStockProductId(product.id);
    setStockQuantity("");
  };

  // Save stock
  const handleStockSave = async (e) => {
    e.preventDefault();
    if (!stockProductId) return;

    const qtyNum = Number(stockQuantity);
    if (Number.isNaN(qtyNum) || qtyNum < 0) {
      alert("Please enter a valid non-negative stock quantity");
      return;
    }

    try {
      setStockSaving(true);
      setError(null);

      await adminApi.updateStock(stockProductId, { availableQuantity: qtyNum });

      await loadProducts();
      setStockProductId(null);
      setStockQuantity("");
    } catch (err) {
      console.error("Failed to update stock", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to update stock: ${backend}`);
    } finally {
      setStockSaving(false);
    }
  };

  // Cloudinary upload helper
  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  };

  // Handle image file select + upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingProductId) {
      e.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const { url, publicId } = await uploadToCloudinary(file);

      const payload = {
        imageUrl: url,
        imageKey: publicId,
        altText: imageAlt || formData.productName || "",
        sortOrder: imageSortOrder ? Number(imageSortOrder) : images.length,
      };

      const res = await adminApi.uploadImage(editingProductId, payload);
      const saved = res.data;

      setImages((prev) => [...prev, saved]);
      setImageAlt("");
      setImageSortOrder("");
      e.target.value = "";
    } catch (err) {
      console.error("Failed to upload image", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to upload image: ${backend}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId) => {
    if (!editingProductId) return;
    if (!window.confirm("Delete this product image?")) return;

    try {
      setError(null);
      await adminApi.deleteImage(editingProductId, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete image", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to delete image: ${backend}`);
    }
  };

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setMetaSaving(true);
      setError(null);

      await adminApi.createCategory({ categoryName: newCategoryName.trim() });

      setNewCategoryName("");
      await loadFilters();
    } catch (err) {
      console.error("Failed to create category", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to create category: ${backend}`);
    } finally {
      setMetaSaving(false);
    }
  };

  // Create new brand
  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    try {
      setMetaSaving(true);
      setError(null);

      await adminApi.createBrand({ brandName: newBrandName.trim() });

      setNewBrandName("");
      await loadFilters();
    } catch (err) {
      console.error("Failed to create brand", err);
      const backend =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setError(`Failed to create brand: ${backend}`);
    } finally {
      setMetaSaving(false);
    }
  };

  // Close modal & reset form
  const closeModal = () => {
    setModalOpen(false);
    setEditingProductId(null);
    setFormData(emptyForm);
    setImages([]);
    setError(null);
  };

  return (
    <div className="admin-page">
      <h2>Manage Products</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Products Table & New Product Button */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h3>Product List</h3>
          <button onClick={startCreate}>+ New Product</button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.sku}</td>
                  <td>{p.productName}</td>
                  <td>₹{p.price}</td>
                  <td>{p.available ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button onClick={() => openStockModal(p)}>Stock</button>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="admin-pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Create/Edit Product */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          if (!saving) closeModal();
        }}
      >
        <h3>{editingProductId ? "Edit Product" : "Create Product"}</h3>
        <form
          className="admin-form"
          onSubmit={async (e) => {
            try {
              await handleSubmit(e);
              if (!error) closeModal();
            } catch {
              // error handled inside handleSubmit already
            }
          }}
        >
          <div className="form-row">
            <label>SKU</label>
            <input
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Name</label>
            <input
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Short Description</label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Price (₹)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Brand</label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
            >
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.brandName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row checkbox-row">
            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
              />
              Available
            </label>
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingProductId
              ? "Update Product"
              : "Create Product"}
          </button>
          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </form>

        {/* Images section only if editing */}
        {editingProductId && (
          <div className="admin-image-section">
            <h3>Product Images</h3>

            <div className="image-upload-panel">
              <div className="form-row">
                <label>Alt Text (optional)</label>
                <input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Front view"
                />
              </div>

              <div className="form-row">
                <label>Sort Order (optional)</label>
                <input
                  type="number"
                  min="0"
                  value={imageSortOrder}
                  onChange={(e) => setImageSortOrder(e.target.value)}
                  placeholder={images.length.toString()}
                />
              </div>

              <div className="form-row">
                <label>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                />
              </div>

              {uploadingImage && <p>Uploading image...</p>}
            </div>

            {images && images.length > 0 ? (
              <div className="admin-images-grid">
                {images.map((img) => (
                  <div key={img.id} className="admin-image-card">
                    <img
                      src={img.imageUrl}
                      alt={img.altText || ""}
                      style={{ maxWidth: "150px", maxHeight: "150px" }}
                    />
                    <p>Alt: {img.altText || "—"}</p>
                    <p>Sort Order: {img.sortOrder}</p>
                    <button onClick={() => handleDeleteImage(img.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images yet for this product.</p>
            )}
          </div>
        )}
      </Modal>

      {/* Stock modal */}
      {stockProductId !== null && (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!stockSaving) {
              setStockProductId(null);
              setStockQuantity("");
            }
          }}
        >
          <h3>Update Stock for Product ID {stockProductId}</h3>
          <form onSubmit={handleStockSave}>
            <div className="form-row">
              <label>Available Quantity</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={stockSaving}>
              {stockSaving ? "Saving..." : "Save Stock"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!stockSaving) {
                  setStockProductId(null);
                  setStockQuantity("");
                }
              }}
              disabled={stockSaving}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        </Modal>
      )}

     {/* Categories & Brands Management */}
<div className="admin-section glass-box">
  <h3>Manage Categories</h3>

  <ul className="admin-list">
    {categories.map((cat) => (
      <li key={cat.id}>{cat.categoryName}</li>
    ))}
  </ul>

  <form onSubmit={handleCreateCategory} className="admin-inline-form">
    <input
      className="glass-input"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      placeholder="New category name"
      required
    />

    <button className="black-btn" type="submit" disabled={metaSaving}>
      {metaSaving ? "Saving..." : "Add Category"}
    </button>
  </form>
</div>

<div className="admin-section glass-box">
  <h3>Manage Brands</h3>

  <ul className="admin-list">
    {brands.map((b) => (
      <li key={b.id}>{b.brandName}</li>
    ))}
  </ul>

  <form onSubmit={handleCreateBrand} className="admin-inline-form">
    <input
      className="glass-input"
      value={newBrandName}
      onChange={(e) => setNewBrandName(e.target.value)}
      placeholder="New brand name"
      required
    />

    <button className="black-btn" type="submit" disabled={metaSaving}>
      {metaSaving ? "Saving..." : "Add Brand"}
    </button>
  </form>
</div>
    </div>
  );
};

export default AdminProducts;
