import { useNavigate } from "@solidjs/router";
import { createSignal, createEffect, Show, For } from "solid-js";

function VideoItem(props) {
  const navigate = useNavigate(); // Initialize the navigation function
  const [liked, setLiked] = createSignal(false); // Tracks if the video is liked
  const [saved, setSaved] = createSignal(false); // Tracks if the video is saved
  const [likeCount, setLikeCount] = createSignal(0); // Tracks total likes
  const [comments, setComments] = createSignal([]); // Tracks comments
  const [showCommentBox, setShowCommentBox] = createSignal(false); // Toggles comment box
  const [newComment, setNewComment] = createSignal(""); // Tracks new comment input

  // Fetch initial states for likes, saves, and comments
  const fetchStates = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch like state and count
      const likeResponse = await fetch(`http://127.0.0.1:8000/api/likes/${props.video.id}/`, { headers });
      if (likeResponse.ok) {
        const likeData = await likeResponse.json();
        setLiked(likeData.is_liked);
        setLikeCount(likeData.like_count); // Assuming like_count is included in the response
      }

      // Fetch save state
      const saveResponse = await fetch(`http://127.0.0.1:8000/api/saved-videos/is-saved/?video_id=${props.video.id}`, { headers });
      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        setSaved(saveData.is_saved);
      }

      // Fetch comments
      const commentResponse = await fetch(`http://127.0.0.1:8000/api/comments/?video=${props.video.id}`);
      if (commentResponse.ok) {
        const commentData = await commentResponse.json();
        setComments(commentData);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  createEffect(() => {
    if (props.video.id) {
      fetchStates();
    }
  });

  // Handle like action
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return console.error("User is not authenticated");

      const response = await fetch("http://127.0.0.1:8000/api/likes/like-video/", {
        method: liked() ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ video: props.video.id }),
      });

      if (response.ok) {
        setLiked(!liked());
        setLikeCount(liked() ? likeCount() - 1 : likeCount() + 1);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  // Handle save action
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return console.error("User is not authenticated");

      const response = await fetch(`http://127.0.0.1:8000/api/saved-videos/${saved() ? "unsave/" : "save/"}`, {
        method: saved() ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ video: props.video.id }),
      });

      if (response.ok) {
        setSaved(!saved());
      }
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  // 3) Toggle the comment box on button click
  const handleCommentToggle = () => {
    setShowCommentBox(!showCommentBox());
  };

  // Handle comment submission
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return console.error("User is not authenticated");

      const response = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          video: props.video.id,
          content: newComment(),
        }),
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments([...comments(), createdComment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div class="mx-auto max-w-md w-full mb-6">
      {/* VIDEO CONTAINER (darker tint) */}
      <div class="bg-neutral-100 shadow-md rounded-t-xl p-4">
        <div 
            class="cursor-pointer"
            onClick={() => navigate(`/details/${props.video.id}`)} // Navigate to details on click
        >
          {/* If you want to display title/description, uncomment: */}
          <h3 class="text-lg font-bold text-neutral-800 mb-2">{props.video.title}</h3>
          <p class="text-sm text-neutral-600 mb-3">{props.video.description}</p>

          <video
            width="320"
            controls
            class="border border-slate-300 rounded mb-3 mx-auto block"
          >
            <source src={props.video.video_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* CONTROLS CONTAINER (lighter tint) */}
      <div class="bg-neutral-50 shadow-inner rounded-b-xl px-4 py-3 flex flex-col items-center">
        {/* Like & Comment Buttons */}
        <div class="flex space-x-6 justify-center mb-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            // Transparent background, with text that goes blue if liked
            class={
              `flex items-center space-x-1 text-sm font-medium
               border-none bg-transparent 
               hover:text-blue-600 focus:outline-none focus:ring-2 
               focus:ring-blue-300 transition-colors ` +
              (liked() ? "text-blue-600" : "text-slate-600")
            }
          >
            {/* Thumbs up emoji (👍) */}
            <span>{liked() ? "👍" : "👍"}</span>
            <span>Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentToggle}
            class="flex items-center space-x-1 text-sm font-medium
                   border-none bg-transparent
                   text-slate-600 hover:text-blue-600 focus:outline-none
                   focus:ring-2 focus:ring-blue-300 transition-colors"
          >
            {/* Comment bubble emoji (💬) */}
            <span>💬</span>
            <span>Comment</span>
          </button>
          <button
            onClick={handleSave}
            class={
              `flex items-center space-x-1 text-sm font-medium
               border-none bg-transparent 
               hover:text-red-600 focus:outline-none focus:ring-2 
               focus:ring-red-300 transition-colors ` +
              (saved() ? "text-red-600" : "text-slate-600")
            }
          >
            <span>{saved() ? "❤️" : "🤍"}</span>
            <span>{saved() ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* If showCommentBox() is true, reveal the comment form + list */}
        <Show when={showCommentBox()}>
          <div class="w-full flex flex-col items-start space-y-3">
            {/* List existing comments */}
            <div class="w-full flex flex-col space-y-2">
              <For each={comments()}>
                {(comment) => (
                  <div class="text-sm text-neutral-700 bg-white p-2 rounded shadow-sm border border-slate-100">
                    {comment.content}
                  </div>
                )}
              </For>
            </div>

            {/* Add New Comment Form */}
            <form onSubmit={handleCommentSubmit} class="w-full flex flex-col space-y-2">
              <textarea
                placeholder="Write a comment..."
                value={newComment()}
                onInput={(e) => setNewComment(e.currentTarget.value)}
                class="p-2 bg-neutral-50 rounded border border-neutral-300
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       text-neutral-700 w-full"
              />
              <button
                type="submit"
                class="py-1 px-3 bg-neutral-500 text-white rounded
                       hover:bg-neutral-600 focus:outline-none focus:ring-2 
                       focus:ring-neutral-400 transition-colors self-end"
              >
                Post Comment
              </button>
            </form>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default VideoItem;
