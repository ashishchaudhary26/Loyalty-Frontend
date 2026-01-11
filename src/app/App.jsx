// import React from "react";
// import { Provider } from "react-redux";
// import { BrowserRouter } from "react-router-dom";
// import Router from "./Router";
// import store from "../redux/store";

// export default function App() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <Router />
//       </BrowserRouter>
//     </Provider>
//   );
// }

import React from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import store from "../redux/store";
import useIdleLogout from "./useIdleLogout";
import SessionExpiredModal from "../components/common/SessionExpiredModal";

/* Inner app so we can access Redux */
function AppContent() {
  const token =
    useSelector(state => state.auth?.token) ||
    localStorage.getItem("token");

  const isAuthenticated = Boolean(token);

  const { showPopup, setShowPopup } = useIdleLogout(isAuthenticated);

  const handleRelogin = () => {
    setShowPopup(false);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {showPopup && <SessionExpiredModal onRelogin={handleRelogin} />}
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

