import { createSignal, createEffect } from "solid-js";

export default function SavedVideos() {
  const [savedVideos, setSavedVideos] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const fetchSavedVideos = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.error("User is not authenticated");
      if (!token) return;

      const response = await fetch("http://127.0.0.1:8000/api/saved-videos/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedVideos(data);
      } else {
        console.error("Failed to fetch saved videos");
      }
    } catch (err) {
      console.error("Error fetching saved videos:", err);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    fetchSavedVideos(); // Fetch saved videos when the component mounts
  });

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center">
      <header class="bg-white shadow-md w-full p-4">
        <h1 class="text-center text-2xl font-semibold">Saved Videos</h1>
      </header>

      {loading() ? (
        <p class="text-center mt-8">Loading saved videos...</p>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-5xl">
          {savedVideos().length > 0 ? (
            savedVideos().map((video) => (
              <div class="bg-white shadow-lg p-4 rounded-lg" key={video.id}>
                <h3 class="text-lg font-semibold">{video.video.title}</h3>
                <p class="text-sm text-gray-600">{video.video.description}</p>
                <video
                  width="100%"
                  controls
                  class="border border-slate-300 rounded mt-3"
                >
                  <source src={video.video.video_file} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))
          ) : (
            <p class="text-center col-span-full">No saved videos found.</p>
          )}
        </div>
      )}
    </div>
  );
}
