import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { fetchData, postData } from "~/lib/api";

export default function FestivalEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [festival, setFestival] = createSignal({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
    is_public: false,
  });

  const [isPublic, setIsPublic] = createSignal(false);
  const [error, setError] = createSignal("");

  // Fetch festival details
  onMount(async () => {
    try {
      const data = await fetchData(`festivals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (data) {
        setFestival(data);
        setIsPublic(data.is_public);
      } else {
        throw new Error("Failed to fetch festival data");
      }
    } catch (err) {
      console.error("Error fetching festival:", err);
      setError("Failed to load festival details.");
    }
  });

  // Handle saving festival updates
  const handleSave = async () => {
    try {
      await postData(
        `festivals/${id}`, 
        {
          name: festival().name,
          description: festival().description,
          start_date: festival().start_date,
          end_date: festival().end_date,
          location: festival().location,
          is_public: isPublic(),
        },
        "PATCH"
      );

      alert("Festival updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating festival:", err);
      setError("Failed to update festival.");
    }
  };

  // Handle festival deletion
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this festival?")) return;

    try {
      await postData(`festivals/${id}/delete`, {}, "DELETE");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting festival:", err);
      setError("Failed to delete festival.");
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
      {/* Header */}
      <header class="bg-white shadow-md w-full max-w-3xl p-4 flex justify-between items-center rounded-lg">
        <div class="cursor-pointer flex items-center" onClick={() => navigate("/profile")}>
          <img src="/donkey.jpg" alt="Avatar" class="w-12 h-12 rounded-full" />
        </div>
        <h1 class="text-2xl font-semibold text-center">Edit Festival Info</h1>
        <button onClick={() => navigate(-1)} class="text-2xl font-bold text-gray-500 hover:text-red-500">
          &times;
        </button>
      </header>

      {/* Form */}
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl mt-8">
        {error() && <p class="text-red-600 text-center mb-4">{error()}</p>}

        <label class="block font-semibold mb-1">Festival Name:</label>
        <input 
          type="text" 
          class="w-full p-2 border rounded mb-4"
          value={festival().name} 
          onInput={(e) => setFestival({ ...festival(), name: e.target.value })}
        />

        <label class="block font-semibold mb-1">Start Date:</label>
        <input 
          type="date" 
          class="w-full p-2 border rounded mb-4"
          value={festival().start_date} 
          onInput={(e) => setFestival({ ...festival(), start_date: e.target.value })}
        />

        <label class="block font-semibold mb-1">End Date:</label>
        <input 
          type="date" 
          class="w-full p-2 border rounded mb-4"
          value={festival().end_date} 
          onInput={(e) => setFestival({ ...festival(), end_date: e.target.value })}
        />

        <label class="block font-semibold mb-1">Location:</label>
        <input 
          type="text" 
          class="w-full p-2 border rounded mb-4"
          value={festival().location} 
          onInput={(e) => setFestival({ ...festival(), location: e.target.value })}
        />

        <label class="block font-semibold mb-1">Description:</label>
        <textarea 
          class="w-full p-2 border rounded mb-4"
          value={festival().description} 
          onInput={(e) => setFestival({ ...festival(), description: e.target.value })}
        ></textarea>

        {/* Public Checkbox */}
        <div class="flex items-center mb-6">
          <input
            type="checkbox"
            id="public"
            checked={isPublic()}
            onChange={() => setIsPublic(!isPublic())}
            class="mr-2 cursor-pointer w-5 h-5"
          />
          <label for="public" class="text-sm font-semibold cursor-pointer">
            Public
          </label>
        </div>

        {/* Buttons Container (Centered) */}
        <div class="flex justify-center gap-6 mt-6 border-t pt-4">
          <button 
            class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            class="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button 
            class="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
