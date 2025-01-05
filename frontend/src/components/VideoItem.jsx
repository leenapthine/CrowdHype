import { createSignal, createEffect, Show, For } from "solid-js";

function VideoItem(props) {
  // props.video: { id, title, description, video_file, ... }

  // Track local "liked" state for styling (doesn't reflect the real backend state)
  const [liked, setLiked] = createSignal(false);

  // Keep your existing "likeCount" if you eventually need it, but not displayed
  const [likeCount, setLikeCount] = createSignal(0);

  // Comments array
  const [comments, setComments] = createSignal([]);
  // Whether we show the comment box
  const [showCommentBox, setShowCommentBox] = createSignal(false);
  // The new comment input
  const [newComment, setNewComment] = createSignal("");

  // 1) Load likes and comments from the backend
  createEffect(() => {
    if (!props.video.id) return;

    // Fetch likes (if you still want to track them)
    fetch(`http://127.0.0.1:8000/api/likes/?video=${props.video.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLikeCount(data.length);
      })
      .catch(console.error);

    // Fetch comments
    fetch(`http://127.0.0.1:8000/api/comments/?video=${props.video.id}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      })
      .catch(console.error);
  });

  // 2) Handle "Like" (still calls your backend, but also toggles local "liked" style)
  const handleLike = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/likes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: 1,  // Hard-coded for now
          video: props.video.id,
        }),
      });
      // Locally toggle "liked" styling
      setLiked(!liked());
      // Optionally increment likeCount if you still want to track it
      // setLikeCount(likeCount() + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // 3) Toggle the comment box on button click
  const handleCommentToggle = () => {
    setShowCommentBox(!showCommentBox());
  };

  // 4) Handle submitting a new comment
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: 1,  // Hard-coded for now
          video: props.video.id,
          content: newComment(),
        }),
      });
      if (response.ok) {
        const createdComment = await response.json();
        // Prepend the new comment at top if you want, or just append
        setComments([...comments(), createdComment]);
        setNewComment("");
      } else {
        console.error("Failed to post comment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div class="mx-auto max-w-md w-full mb-6">
      {/* VIDEO CONTAINER (darker tint) */}
      <div class="bg-neutral-100 shadow-md rounded-t-xl p-4">
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
