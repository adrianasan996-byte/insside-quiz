import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Nota: sin <React.StrictMode> a propósito. El doble montaje que hace
// StrictMode en desarrollo reinicia las animaciones de entrada de
// framer-motion y hace que las transiciones se vean con "saltos".
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
