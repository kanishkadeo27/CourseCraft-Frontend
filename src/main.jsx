import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

// Global styles
import "./assets/styles/global.css";
import "./assets/styles/style.css";

// Course theme styles (needed for CourseCard component)
import "./assets/styles/course/normalize.css";
import "./assets/styles/course/bootstrap.min.css";
import "./assets/styles/course/animate.min.css";
import "./assets/styles/course/style.css";
import "./assets/styles/course/responsive.css";
import "./assets/styles/course/color1.css";

// Footer styles
import "./assets/styles/common/footer_style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
