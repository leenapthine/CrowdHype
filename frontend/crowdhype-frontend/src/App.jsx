import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

// crowdhype-frontend/src/App.jsx
import VideoList from "./components/VideoList";

function App() {
  return (
    <main>
      <h1>Welcome to CrowdHype</h1>
      <VideoList />
    </main>
  );
}

export default App;

