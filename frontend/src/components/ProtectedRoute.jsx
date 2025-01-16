import { Navigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

function ProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

  onMount(() => {
    setIsAuthenticated(!!localStorage.getItem("accessToken"));
  });

  return isAuthenticated() ? props.children : <Navigate href="/login" />;
}

export default ProtectedRoute;
