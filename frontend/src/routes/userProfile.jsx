import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function UserProfile() {
  const [user] = createSignal({
    avatar: "/donkey.jpg",
    name: "John Doe",
    location: "New York, USA",
  });

  const navigate = useNavigate();

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header class="bg-white shadow-md w-full p-4">
        <h1 class="text-center text-2xl font-semibold">User Profile</h1>
      </header>

      {/* Profile Details */}
      <div class="bg-white shadow-lg p-6 mt-8 rounded-lg w-96">
        <img
          src={user().avatar}
          alt="Avatar"
          class="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 class="text-center text-xl font-semibold">{user().name}</h2>
        <p class="text-center text-gray-500">{user().location}</p>
        <hr class="my-4" />

        {/* Profile Links */}
        <ul class="space-y-2">
          <li class="text-blue-600 hover:underline cursor-pointer">Personal Information</li>
          <li class="text-blue-600 hover:underline cursor-pointer">Notification</li>
          <li class="text-blue-600 hover:underline cursor-pointer">Wishlist</li>
          <li
            class="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/saved")} // Navigate to /saved
          >
            Saved
          </li>
          <li class="text-blue-600 hover:underline cursor-pointer">Settings</li>
        </ul>
      </div>
    </div>
  );
}
