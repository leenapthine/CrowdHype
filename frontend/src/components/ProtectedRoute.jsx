import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";

function ProtectedRoute(props) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [userRole, setUserRole] = createSignal(null);
  const [isReady, setIsReady] = createSignal(false);

  onMount(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    setIsReady(true);
  });

  return (
    <Show when={isReady()} fallback={null}>
      {isAuthenticated() ? (
        // **Role-Based Protection**
        props.promoterOnly && userRole() !== "promoter" ? (
          <Navigate href="/home" />
        ) : props.memberOnly && userRole() !== "member" ? (
          <Navigate href="/dashboard" />
        ) : (
          props.children
        )
      ) : (
        <Navigate href="/login" />
      )}
    </Show>
  );
}

export default ProtectedRoute;
