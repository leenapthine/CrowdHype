import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { loginUser } from "~/lib/api";

function Login() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(username(), password());

      if (data?.access) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("role", data.role);

        // Redirect user based on role
        navigate(data.role === "promoter" ? "/dashboard" : "/home");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
      <form
        onSubmit={handleLogin}
        class="bg-white p-8 shadow-md rounded-md max-w-sm w-full"
      >
        <h1 class="text-xl font-semibold mb-4 text-center">Login</h1>
        {error() && (
          <p class="text-red-600 text-sm text-center mb-4">{error()}</p>
        )}
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
            required
            class="w-full p-2 border rounded-md"
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
            class="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-neutral-600 text-white rounded-md hover:bg-neutral-700"
        >
          Login
        </button>

        {/* Sign Up Link */}
        <div class="mt-4 text-center">
          <p class="text-sm text-neutral-600">
            Don't have an account?{" "}
            <span
              class="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
