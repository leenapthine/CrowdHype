import { createSignal, createEffect } from "solid-js";
import VideoItem from "./VideoItem";

function VideoList() {
  const [videos, setVideos] = createSignal([]);

  createEffect(() => {
    fetch("http://127.0.0.1:8000/api/videos/")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
      })
      .catch(console.error);
  });

  return (
    <div >
      {videos().map((video) => (
        <VideoItem video={video} />
      ))}
    </div>
  );
}

export default VideoList;
