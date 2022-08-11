import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "./utils/createApolloClient";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={createApolloClient()}>
    <App />
  </ApolloProvider>
);
