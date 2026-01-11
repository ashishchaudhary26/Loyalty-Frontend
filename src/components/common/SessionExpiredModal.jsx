export default function SessionExpiredModal({ onRelogin }) {
  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Session Expired</h2>
        <p>You were logged out due to inactivity.</p>
        <button onClick={onRelogin}>Login Again</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
};
