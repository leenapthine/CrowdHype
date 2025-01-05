import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

// crowdhype-frontend/src/App.jsx
import VideoList from "./components/VideoList";
import UploadVideo from "./components/UploadVideo";

function App() {
  return (
    <main>
      <h1>Welcome to CrowdHype</h1>
      <h2>Upload a video</h2>
      <UploadVideo /> 
      <h2>Your Stream</h2>
      <VideoList />
    </main>
  );
}

export default App;

