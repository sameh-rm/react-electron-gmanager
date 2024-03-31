import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ErrorBoundary from "./components/error/ErrorBoundry";
import ImportedLinks from "./ImportedLinks";
import DefaultLayout from "./DefaultLayout";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <ErrorBoundary>
      <ImportedLinks />
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </ErrorBoundary>
  );
};

export default App;
