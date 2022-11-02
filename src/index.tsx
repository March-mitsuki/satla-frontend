/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";

import { Router, useRoutes } from "@solidjs/router";
import { MetaProvider } from "@solidjs/meta";
import routes from "~solid-pages";

render(() => {
  const Routes = useRoutes(routes);
  return (
    <MetaProvider>
      <Router>
        <Routes />
      </Router>
    </MetaProvider>
  );
}, document.getElementById("root") as HTMLElement);
