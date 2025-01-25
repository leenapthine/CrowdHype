import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import CameraPopup from "~/components/CameraPopup";
import UploadVideo from "~/components/UploadVideo";
import VideoList from "~/components/VideoList";

export default function Home() {
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = createSignal(false);
  const [showUploadVideo, setShowUploadVideo] = createSignal(false);
  const [preloadedVideo, setPreloadedVideo] = createSignal(null);

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleSaveVideo = (file) => {
    console.log("Video File Sent to UploadVideo:", file);
    setPreloadedVideo(file);
    setShowCamera(false);
    setShowUploadVideo(true);
  };

  return (
        <div class="min-h-screen bg-gradient-to-tr from-neutral-50 to-neutral-100 text-neutral-800 flex flex-col">
          {/* Header */}
          <div class="bg-neutral-100 shadow-md p-4 sticky top-0 z-10">
            <header class="p-2 shadow-md bg-white flex items-center justify-between px-6">
              <div class="leading-none text-left">
                <h1 class="text-3xl font-bold">.crowd</h1>
                <h1 class="text-4xl font-bold">HYPE</h1>
              </div>
              <div class="flex items-center gap-4">
                {/* Avatar */}
                <div
                  class="cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src="/donkey.jpg"
                    alt="Avatar"
                    class="w-12 h-12 rounded-full"
                  />
                </div>
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  class="bg-neutral-500 text-white px-4 py-2 rounded-md hover:bg-neutral-600"
                >
                  Sign Out
                </button>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <img 
                  src="/rec-button.png" 
                  alt="rec" 
                  class="h-14 w-auto mr-0 cursor-pointer"
                  onClick={() => setShowCamera(true)}
                />
              </div>
            </header>
          </div>

          {/* Main Content: Left Aside + Feed + Right Aside */}
          <main class="flex flex-1 flex-col md:flex-row perspective-1000">
            {/* Left Aside (extra content or placeholder) */}
            <aside
              class="w-full md:w-80 md:flex-shrink md:min-w-[150px] p-6 border-b border-neutral-300 
                    md:border-b-0 md:border-r md:border-neutral-300 bg-white shadow-xl rounded-b-2xl 
                    md:rounded-r-none md:rounded-b-none md:overflow-y-auto md:h-screen"
            >
              <h2 class="text-lg font-semibold mb-4">User Profile</h2>
              <p class="text-sm text-neutral-600">
                {/* Put any content here: trending videos, user stats, etc. */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Maecenas euismod, lacus at vestibulum semper, sapien diam 
                hendrerit est, nec tempus enim massa id arcu.
              </p>
            </aside>

            {/* Feed Section (center) */}
            <section
              class="flex-1 p-6 max-w-5xl mx-auto transform
                    md:rotate-x-1 md:-rotate-y-1 transition-transform ease-in-out 
                    overflow-y-auto h-screen min-w-[375px]"
            >
              <div class="bg-white shadow-xl rounded-2xl p-6">
                {/* <h2 class="text-xl font-semibold mb-4">Your Stream</h2> */}
                <VideoList />
              </div>
            </section>

            {/* Right Aside / Upload Form */}
            <aside
              class="w-full md:w-80 p-6 border-t border-neutral-300
                    md:border-t-0 md:border-l md:border-neutral-300 bg-white shadow-xl
                    rounded-t-2xl md:rounded-l-2xl md:rounded-t-none
                    flex flex-col justify-start overflow-y-auto h-screen md:min-w-[300px]"
            >
              <h2 class="text-lg font-semibold mb-4">Upload a Video</h2>
              <UploadVideo />
            </aside>
          </main>

          {/* Footer */}
          <footer class="p-4 bg-white border-t border-neutral-300 text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} CrowdHype
          </footer>

          {/* Camera Popup */}
          {showCamera() && (
            <div class="fixed inset-0 bg-black bg-opacity-50 
                    flex items-center justify-center
                    z-50"
            >
              <CameraPopup 
                onClose={() => setShowCamera(false)}
                onSave={handleSaveVideo}
            />
            </div>
          )}

          {/* Upload Video Popup */}
          {showUploadVideo() && (
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full">
                <h2 class="text-lg font-semibold mb-4">Upload Your Recorded Video</h2>
                <UploadVideo preloadedVideo={preloadedVideo()} />
                <button 
                  onClick={() => setShowUploadVideo(false)}
                  class="mt-4 py-2 px-4 bg-neutral-500 text-white rounded hover:bg-neutral-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
  );
}
