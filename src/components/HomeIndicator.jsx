// src/components/HomeIndicator.jsx

export default function HomeIndicator({ white = false }) {
  return (
    <div className={`wallet-home-area ${white ? "white" : ""}`} aria-hidden="true">
      <span />
    </div>
  );
}
