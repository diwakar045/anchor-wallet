// src/components/DetailsCard.jsx

export function DetailsRow({
  label,
  sublabel,
  value,
  subvalue,
  action,
  isTotal = false,
  dashedAbove = false,
  className = "",
}) {
  return (
    <div
      className={`details-row ${dashedAbove ? "dashed-above" : ""} ${className}`}
    >
      <div className="details-label-col">
        <span className="details-label">{label}</span>
        {sublabel && <span className="details-sublabel">{sublabel}</span>}
      </div>

      <div className="details-value-col">
        {value !== undefined && (
          <div className={`details-value ${isTotal ? "highlight-blue" : ""}`}>
            {value}
          </div>
        )}
        {subvalue && <div className="details-subvalue">{subvalue}</div>}
        {action}
      </div>
    </div>
  );
}

export default function DetailsCard({ children, className = "" }) {
  return <div className={`details-card ${className}`}>{children}</div>;
}
