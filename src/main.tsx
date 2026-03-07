import { createRoot } from "react-dom/client";
import { Component, ErrorInfo, ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

// Error boundary to catch crashes and show a message instead of blank screen
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#0a0a0a", color: "#00ff88", fontFamily: "sans-serif", flexDirection: "column", padding: "20px"
        }}>
          <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#00ff88", color: "#0a0a0a", border: "none", padding: "12px 24px",
              borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px"
            }}
          >
            RELOAD
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Hide the HTML loading screen once React takes over
const loader = document.getElementById("app-loader");
if (loader) loader.style.display = "none";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
