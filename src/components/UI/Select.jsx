import "./ui.css";

export default function Select({ label, options=[], value, onChange, error }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}

      <select value={value} onChange={onChange} className={error ? "input-error" : ""}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
