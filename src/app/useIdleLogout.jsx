import { useEffect, useRef, useState } from "react";

const IDLE_TIME = 15 * 1000; // 15 sec for testing

const useIdleLogout = () => {
  console.log(" useIdleLogout mounted");

  const timerRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const logout = () => {
    console.log(" User idle → logout");
    setShowPopup(true);
  };

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, IDLE_TIME);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return { showPopup, setShowPopup };
};

export default useIdleLogout;
