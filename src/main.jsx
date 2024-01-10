import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/sb-admin-2.css";
import "./assets/vendor/fontawesome-free/css/all.min.css";

import "./assets/js/sb-admin-2.min.js";
import "./assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "./assets/vendor/jquery-easing/jquery.easing.min.js";
import { ErrorProvider } from "./Components/ErrorContext.jsx";
import { HashRouter } from "react-router-dom";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ErrorProvider>
        <App />
    </ErrorProvider>
  </HashRouter>
);
