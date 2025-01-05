import { createSignal } from 'solid-js'
import './index.css'

// crowdhype-frontend/src/App.jsx
import VideoList from "./components/VideoList";
import UploadVideo from "./components/UploadVideo";

function App() {
  return (
    <div class="min-h-screen bg-gradient-to-tr from-neutral-50 to-neutral-100 text-neutral-800 flex flex-col">
      {/* Header */}
      <div class="bg-neutral-100 shadow-md p-4">
        <header class="p-6 shadow-md bg-white text-center">
            <h1 class="text-3xl font-bold ">.crowd</h1>
            <h1 class="text-4xl font-bold">HYPE</h1>
        </header>
      </div>

      {/* Main Content: Left Aside + Feed + Right Aside */}
      <main class="flex flex-1 flex-col md:flex-row perspective-1000">
        {/* Left Aside (extra content or placeholder) */}
        <aside
          class="w-full md:w-64 p-6 border-b border-neutral-300 md:border-b-0 md:border-r md:border-neutral-300
                 bg-white shadow-xl rounded-b-2xl md:rounded-r-none md:rounded-b-none
                 flex flex-col justify-start"
        >
          <h2 class="text-lg font-semibold mb-4">Left Sidebar</h2>
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
                 md:rotate-x-1 md:-rotate-y-1 transition-transform ease-in-out"
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
                 flex flex-col justify-start"
        >
          <h2 class="text-lg font-semibold mb-4">Upload a Video</h2>
          <UploadVideo />
        </aside>
      </main>

      {/* Footer */}
      <footer class="p-4 bg-white border-t border-neutral-300 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} CrowdHype
      </footer>
    </div>
  );
}

export default App;

