import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import ProtectedRoute from "~/components/ProtectedRoute";
import UserProfile from "~/routes/userProfile";
import SavedVideos from "~/routes/savedVideos";
import Footer from "~/components/Footer";
import SignUp from "~/routes/signup";
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
      <Route path="/signup" component={SignUp} />

      {/* Protected routes */}
      <Route
        path="/home/*"
        component={() => (
          <ProtectedRoute>
            <Home />
            <Footer />
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
    </Router>
  );
}
