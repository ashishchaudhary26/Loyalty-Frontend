// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/home/Home";
// import Products from "./pages/products/Products";
// import ProductDetail from "./pages/products/ProductDetail";
// import CategoriesPage from "./pages/categories/CategoriesPage"; // ✅ ADD THIS
// import Reward from "./pages/reward/ComingSoon";
// import useIdleLogout from "./app/useIdleLogout";
// import SessionExpiredModal from "./components/SessionExpiredModal";

// function App() {
//   const { showPopup, setShowPopup } = useIdleLogout();

//   const handleRelogin = () => {
//     setShowPopup(false);
//     window.location.href = "/login";
//   };
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/products/:productId" element={<ProductDetail />} />
// <         Route path="/reward" element={<ComingSoon />} />

//         {/* Now correct */}
//         <Route path="/categories" element={<CategoriesPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useEffect } from "react";

// import Home from "./pages/home/Home";
// import Products from "./pages/products/Products";
// import ProductDetail from "./pages/products/ProductDetail";
// import CategoriesPage from "./pages/categories/CategoriesPage";
// import ComingSoon from "./pages/reward/ComingSoon";

// import useIdleLogout from "./app/useIdleLogout";
// import SessionExpiredModal from "./components/common/SessionExpiredModal";

// function App() {
//   console.log("App.js is running");

//   const { showPopup, setShowPopup } = useIdleLogout();

//   // Listen for backend-triggered logout (401)
//   useEffect(() => {
//     const handleSessionExpired = () => {
//       setShowPopup(true);
//     };

//     window.addEventListener("session-expired", handleSessionExpired);

//     return () => {
//       window.removeEventListener("session-expired", handleSessionExpired);
//     };
//   }, [setShowPopup]);

//   const handleRelogin = () => {
//     setShowPopup(false);
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   return (
//     <>
//       {showPopup && <SessionExpiredModal onRelogin={handleRelogin} />}

//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:productId" element={<ProductDetail />} />
//           <Route path="/reward" element={<ComingSoon />} />
//           <Route path="/categories" element={<CategoriesPage />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;



function App() {
  console.log("✅ App.js rendered");

  const { showPopup, setShowPopup } = useIdleLogout();

  const handleRelogin = () => {
    console.log("🔁 Relogin clicked");
    setShowPopup(false);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {showPopup && <SessionExpiredModal onRelogin={handleRelogin} />}

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/reward" element={<ComingSoon />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Router>
    </>
  );
}
