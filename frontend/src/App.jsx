import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./index.css"


export default function App() {
  return (
    <Router
      root={props => (
        <>
        <MetaProvider>
          <Title>CrowdHype</Title>
        </MetaProvider>
        {props.children}
        </>
      )}>
        <FileRoutes />
    </Router>
  );
}
