import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Route, Navigate } from "@solidjs/router";
import { createSignal, createEffect } from "solid-js";
import ProtectedRoute from "~/components/ProtectedRoute";
import UserProfile from "~/routes/userProfile";
import SavedVideos from "~/routes/savedVideos";
import Dashboard from "~/routes/dashboard";
import FestivalManage from "./routes/festivalManage";
import FestivalEdit from "./routes/festivalEdit";
import Details from "./routes/details";
import Footer from "~/components/Footer";
import SignUp from "~/routes/signup";
import Home from "~/routes/home";
import Login from "~/routes/login";
import "./index.css";

export default function App() {
  const [showFooter, setShowFooter] = createSignal(true);
  // const role = localStorage.getItem("role");
  const [role, setRole] = createSignal(null); // Store the role in a reactive signal

  // Only access localStorage on the client
  createEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  });

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
      <Route path="/" component={() => <Navigate href={role() === "promoter" ? "/dashboard" : "/home"} />} />
      <Route path="/login" component={Login} />
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
      {/* Promoter Routes */}
      <Route
        path="/dashboard"
        component={() => (
          <ProtectedRoute promoterOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      {/* Festival Management Routes */}
      <Route
        path="/dashboard/festival/:id"
        component={() => (
          <ProtectedRoute promoterOnly={true}>
            <FestivalManage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/dashboard/festival/:id/edit"
        component={() => (
          <ProtectedRoute promoterOnly={true}>
            <FestivalEdit />
          </ProtectedRoute>
        )}
      />
    </Router>
  );
}
