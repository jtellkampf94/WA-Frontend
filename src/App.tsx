import "./styles/globals.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "./utils/createApolloClient";
import { Theme } from "./themes";

import Home from "./pages/Home";

const App = () => {
  return (
    <ApolloProvider client={createApolloClient()}>
      <Theme>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Theme>
    </ApolloProvider>
  );
};

export default App;
