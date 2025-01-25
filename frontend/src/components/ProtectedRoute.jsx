import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";

function ProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    const token = localStorage.getItem("accessToken");
    const authState = !!token;
    setIsAuthenticated(authState);
    setIsReady(true);
  });

  return (
    <Show when={isReady()} fallback={null}>
      {isAuthenticated() ? props.children : <Navigate href="/login" />}
    </Show>
  );
}

export default ProtectedRoute;
