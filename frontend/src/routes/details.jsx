import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [video, setVideo] = createSignal(null); // Initially null
  const [loading, setLoading] = createSignal(true); // Initially true

  onMount(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/videos/${id}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch video details");
      }
      const data = await response.json();
      setVideo(() => data); // Update video
      console.log("Video loaded:", data); // Logs the correct data
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(() => false); // Stop loading
    }
  });

  // **Critical fix**: Skip all rendering until loading is complete
  return (
    <div>
      {loading() ? (
        <p>Loading...</p>
      ) : video() ? (
        <div class="min-h-screen bg-gray-50 flex flex-col items-center">
          {/* Header */}
          <header class="bg-white shadow-md w-full p-4 flex justify-between items-center">
            <div
              class="cursor-pointer flex items-center"
              onClick={() => navigate("/profile")}
            >
              <img src="/donkey.jpg" alt="Avatar" class="w-12 h-12 rounded-full" />
            </div>
            <h1 class="text-2xl font-semibold text-center absolute left-1/2 transform -translate-x-1/2">
                Video Details
            </h1>  
            <button
              onClick={() => navigate(-1)}
              class="text-2xl font-bold text-gray-500 hover:text-red-500"
            >
              &times;
            </button>
          </header>

          {/* Video Details */}
          <main class="w-full max-w-4xl p-6 bg-white shadow-md rounded-md mt-6">
            <video
              controls
              class="w-full border border-gray-300 rounded-md mb-4"
            >
              <source src={video().video_file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 class="text-2xl font-semibold mb-2">{video().title}</h1>
            <p class="text-sm text-gray-500 mb-4">
              Uploaded by {video().uploader} on{" "}
              {new Date(video().upload_date).toLocaleDateString()}
            </p>
            <p class="mb-4">{video().description}</p>
            <div class="flex flex-col gap-4">
              {/* Dummy Links */}
              <button
                class="text-blue-500 underline hover:text-blue-700"
                onClick={() => console.log("Navigate to festival")}
              >
                Festival: {video().festival || "No Festival Linked"}
              </button>
              <button
                class="text-blue-500 underline hover:text-blue-700"
                onClick={() => console.log("Directions link clicked")}
              >
                Get Directions
              </button>
              <button
                class="text-blue-500 underline hover:text-blue-700"
                onClick={() => console.log("Share link clicked")}
              >
                Share
              </button>
            </div>
          </main>
        </div>
      ) : (
        <p>Error loading video details.</p>
      )}
    </div>
  );
}
