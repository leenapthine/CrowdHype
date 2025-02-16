import { createSignal, createEffect } from "solid-js";
import VideoItem from "./VideoItem";
import { fetchData } from "~/lib/api";

function VideoList() {
  const [videos, setVideos] = createSignal([]);
  const [error, setError] = createSignal(null)

  createEffect(async () => {
    try {
      const data = await fetchData("videos");
      if (data) {
        setVideos(data);
      } else {
        throw new Error("No videos found");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos. Please try again later.");
    }
  });

  return (
    <div>
      {error() ? (
        <p class="text-red-500 text-center">{error()}</p>
      ) : (
        videos().map((video) => <VideoItem video={video} />)
      )}
    </div>
  );
}

export default VideoList;
