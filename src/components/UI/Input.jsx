import "./ui.css";

export default function Input({ label, type="text", value, onChange, placeholder, error }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
