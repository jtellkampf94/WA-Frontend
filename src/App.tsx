import "./styles/globals.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Theme } from "./themes";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useGetCurrentUserQuery } from "./generated/graphql";

const App = () => {
  const { data, loading, error } = useGetCurrentUserQuery();
  return (
    <Theme>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loading={loading} error={error} user={data}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={data ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={data ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="*"
            element={
              <div>
                <h1>404</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </Theme>
  );
};

export default App;
