import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import ProtectedRoute from "~/components/ProtectedRoute";
import UserProfile from "~/routes/userProfile";
import Home from "~/routes/home";
import Login from "~/routes/login";
import "./index.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <MetaProvider>
            <Title>CrowdHype</Title>
          </MetaProvider>
          {props.children}
        </>
      )}
    >
      {/* Public routes */}
      <Route path="/login" component={() => Login } />

      {/* Protected routes */}
      <Route
        path="/home/*"
        component={() => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/profile/*"
        component={() => (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        )}
      />
    </Router>
  );
}
