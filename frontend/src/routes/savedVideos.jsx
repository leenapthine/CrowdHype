import { createSignal, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Footer from "~/components/Footer";
import { fetchData } from "~/lib/api";

export default function SavedVideos() {
  const navigate = useNavigate();
  const [savedVideos, setSavedVideos] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const fetchSavedVideos = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const data = await fetchData("saved-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data) {
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
        <div class="bg-neutral-100 shadow-md p-4 top-0 z-10 flex items-center justify-between">  
          {/* CrowdHYPE Branding */}
          <div
            class="text-left cursor-pointer"
            onClick={() => navigate("/home")} // Navigate to the home page
          >
            <h1 class="text-3xl font-bold">.crowd</h1>
            <h1 class="text-4xl font-bold">HYPE</h1>
          </div>

          {/* Saved Videos Title */}
          <h1 class="text-2xl font-semibold text-center absolute left-1/2 transform -translate-x-1/2">
            Saved Videos
          </h1>        
        </div>
      </header>

      {loading() ? (
        <p class="text-center mt-8">Loading saved videos...</p>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-5xl">
          {savedVideos().length > 0 ? (
            savedVideos().map((video) => (
              <div 
                class="bg-white shadow-lg p-4 rounded-lg"
                key={video.id}
                onClick={() => navigate(`/details/${video.video.id}`)}
              >
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
      <Footer />
    </div>
  );
}
