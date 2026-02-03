import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/console-override";

// Check for maintenance mode
if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
  document.body.innerHTML = `
    <div style="
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: white;
    ">
      <div style="
        text-align: center;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        max-width: 500px;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🍽️</div>
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: #fff;">Cravings Delight</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">We're temporarily unavailable while we prepare something amazing for you!</p>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">We'll be back soon. Thank you for your patience.</p>
        <div style="margin-top: 2rem; font-size: 1rem; opacity: 0.8;">
          <p>For urgent inquiries, please contact us directly.</p>
        </div>
      </div>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(<App />);
}
