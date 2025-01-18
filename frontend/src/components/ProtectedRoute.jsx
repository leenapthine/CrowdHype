import { Navigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

function ProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Token in localStorage:", token);
    const authState = !!token;
    console.log("Setting isAuthenticated to:", authState);
    setIsAuthenticated(authState);
    setIsReady(true);
  });

    <Show when={isReady()} fallback={null}>
      {isAuthenticated() ? props.children : <Navigate href="/login" />}
    </Show>
}

export default ProtectedRoute;
