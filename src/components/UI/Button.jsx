import "./ui.css";

export default function Button({ text, onClick, type="button", disabled=false, variant="primary" }) {
  return (
    <button 
      className={`btn ${variant}`} 
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
