import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

function SignUp() {
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [role, setRole] = createSignal("member");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username(),
          email: email(),
          password: password(),
          role: role(),
        }),
      });

    const text = await response.text();
    console.log("Response text:", text);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.username?.[0] || "Failed to sign up.");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500); // Redirect to login after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
      <form
        onSubmit={handleSignUp}
        class="bg-white p-8 shadow-md rounded-md max-w-sm w-full"
      >
        <h1 class="text-xl font-semibold mb-4 text-center">Sign Up</h1>
        {success() && (
          <p class="text-green-600 text-sm text-center mb-4">Sign-Up Successful!</p>
        )}
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
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
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
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Role</label>
          <select
            value={role()}
            onInput={(e) => setRole(e.currentTarget.value)}
            class="w-full p-2 border rounded-md"
          >
            <option value="member">Member</option>
            <option value="promoter">Promoter</option>
          </select>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-neutral-600 text-white rounded-md hover:bg-neutral-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
