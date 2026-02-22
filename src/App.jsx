import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListProducts from "./components/ListProducts";
import Comparator from "./components/Comparator";
import Home from "./pages/Home";
import PerfilUser from "./pages/PerfilUser";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparator" element={<Comparator />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
