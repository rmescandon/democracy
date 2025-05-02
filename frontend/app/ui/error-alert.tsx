import React from "react";

interface ErrorAlertProps {
  error?: Error;
  onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => (
  <div
    style={{
      background: "#fee2e2",
      color: "#b91c1c",
      border: "1px solid #fca5a5",
      borderRadius: 4,
      padding: 16,
      margin: "16px 0",
    }}
  >
    <strong>Error:</strong> {error?.message || "Something went wrong."}
    <div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 8,
          background: "#b91c1c",
          color: "white",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
);

export default ErrorAlert;
