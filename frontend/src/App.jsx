import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import { createSignal } from "solid-js";
import ProtectedRoute from "~/components/ProtectedRoute";
import UserProfile from "~/routes/userProfile";
import SavedVideos from "~/routes/savedVideos";
import Details from "./routes/details";
import Footer from "~/components/Footer";
import SignUp from "~/routes/signup";
import Home from "~/routes/home";
import Login from "~/routes/login";
import "./index.css";

export default function App() {
  const [showFooter, setShowFooter] = createSignal(true);

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
      <Route path="/signup" component={SignUp} />

      {/* Protected routes */}
      <Route
        path="/home/*"
        component={() => (
          <ProtectedRoute>
            <Home setShowFooter={setShowFooter} />
            {showFooter() && <Footer />}
          </ProtectedRoute>
        )}
      />
      <Route
        path="/profile/*"
        component={() => (
          <ProtectedRoute>
            <UserProfile />
            <Footer />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/saved"
        component={() => (
          <ProtectedRoute>
            <SavedVideos />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/details/:id"
        component={() => (
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        )}
      />
    </Router>
  );
}
