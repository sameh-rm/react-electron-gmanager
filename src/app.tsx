import { createRoot } from "react-dom/client";
import App from "@ui/App";
import { StoreProvicder } from "@ui/redux/StoreProvicder";

const root = createRoot(document.body);

root.render(
  <StoreProvicder>
    <App />
  </StoreProvicder>
);
