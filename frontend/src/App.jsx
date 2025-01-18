import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import ProtectedRoute from "~/components/ProtectedRoute";
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
        <Route
          path="/home/*"
          component={() => (
            <ProtectedRoute>
              <FileRoutes />
            </ProtectedRoute>
          )}
        />
        { /* Public routes */}
         <FileRoutes />
    </Router>
  );
}
