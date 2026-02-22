import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ProductContextProvider } from "./context/ProductContext.jsx";
import { FiltrosContextProvider } from "./context/FiltrosContext.jsx";
import { SortProvider } from "./context/SortContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <ProductContextProvider>
            <FiltrosContextProvider>
              <SortProvider>
                <App />
              </SortProvider>
            </FiltrosContextProvider>
          </ProductContextProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
