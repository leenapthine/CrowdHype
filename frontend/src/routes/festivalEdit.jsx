import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function FestivalEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [festival, setFestival] = createSignal(null);
  const [isPublic, setIsPublic] = createSignal(festival?.is_public || false);

  const togglePublic = () => {
    setIsPublic(!isPublic()); // Toggle between true/false
  };

  onMount(async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/festivals/${id}/`);
    const data = await response.json();
    setFestival(data);
  });

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
      {/* Header */}
      <header class="bg-white shadow-md w-full max-w-3xl p-4 flex justify-between items-center rounded-lg">
        <div
          class="cursor-pointer flex items-center"
          onClick={() => navigate("/profile")}
        >
          <img src="/donkey.jpg" alt="Avatar" class="w-12 h-12 rounded-full" />
        </div>
        <h1 class="text-2xl font-semibold text-center">Edit Festival Info</h1>
        <button
          onClick={() => navigate(-1)}
          class="text-2xl font-bold text-gray-500 hover:text-red-500"
        >
          &times;
        </button>
      </header>
  
      {/* Form */}
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl mt-8">
        <label class="block font-semibold mb-1">Festival Name:</label>
        <input type="text" class="w-full p-2 border rounded mb-4" value={festival()?.name} />
  
        <label class="block font-semibold mb-1">Festival Date:</label>
        <input type="date" class="w-full p-2 border rounded mb-4" value={festival()?.start_date} />
  
        <label class="block font-semibold mb-1">Location:</label>
        <input type="text" class="w-full p-2 border rounded mb-4" value={festival()?.location} />
  
        <label class="block font-semibold mb-1">Description:</label>
        <textarea class="w-full p-2 border rounded mb-4">{festival()?.description}</textarea>
  
        {/* Public Checkbox (Always says "Public") */}
        <div class="flex items-center mb-6">
          <input
            type="checkbox"
            id="public"
            checked={isPublic()}
            onChange={togglePublic}
            class="mr-2 cursor-pointer w-5 h-5"
          />
          <label for="public" class="text-sm font-semibold cursor-pointer">
            Public
          </label>
        </div>
  
        {/* Buttons Container (Centered) */}
        <div class="flex justify-center gap-6 mt-6 border-t pt-4">
          <button class="px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition">
            Save
          </button>
          <button
            class="px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
