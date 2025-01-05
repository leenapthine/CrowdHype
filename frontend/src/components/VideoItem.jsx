// crowdhype-frontend/src/components/VideoItem.jsx
import { createSignal, createEffect, Show, For } from "solid-js";

function VideoItem(props) {
  // props.video: { id, title, description, video_file, ... }

  const [likeCount, setLikeCount] = createSignal(0);
  const [comments, setComments] = createSignal([]);
  const [newComment, setNewComment] = createSignal("");

  // 1) Load existing likes and comments for this video
  createEffect(() => {
    if (!props.video.id) return;

    // Fetch likes for this video
    fetch(`http://127.0.0.1:8000/api/likes/?video=${props.video.id}`)
      .then((res) => res.json())
      .then((data) => {
        // data is an array of likes
        setLikeCount(data.length);
      })
      .catch(console.error);

    // Fetch comments for this video
    fetch(`http://127.0.0.1:8000/api/comments/?video=${props.video.id}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
      })
      .catch(console.error);
  });

  // 2) Handle "Like" button click
  const handleLike = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/likes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: 1,          // Hard-coded user
          video: props.video.id,
        }),
      });
      // After success, increment the local like count
      setLikeCount(likeCount() + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // 3) Handle adding a new comment
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: 1,           // Hard-coded user
          video: props.video.id,
          content: newComment(),
        }),
      });
      if (response.ok) {
        // If successful, fetch the updated comment list or just append to local array
        const createdComment = await response.json();
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
    <div>
      <h3>{props.video.title}</h3>
      <p>{props.video.description}</p>

      <video width="320" controls>
        <source src={props.video.video_file} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={{ "margin-top": "1em" }}>
        <button onClick={handleLike}>Like</button>
        <span style={{ "margin-left": "0.5em" }}>
          {likeCount()} {likeCount() === 1 ? "Like" : "Likes"}
        </span>
      </div>

      <div style={{ "margin-top": "1em" }}>
        <h4>Comments</h4>
        <For each={comments()}>
          {(comment) => (
            <div style={{ "border-bottom": "1px solid #ccc", "margin-bottom": "0.5em" }}>
              <p>{comment.content}</p>
              <small>Comment ID: {comment.id}</small>
            </div>
          )}
        </For>

        {/* Simple form to add a comment */}
        <form onSubmit={handleCommentSubmit} style={{ "margin-top": "1em" }}>
          <textarea
            placeholder="Write a comment..."
            value={newComment()}
            onInput={(e) => setNewComment(e.currentTarget.value)}
          />
          <br />
          <button type="submit">Post Comment</button>
        </form>
      </div>
    </div>
  );
}

export default VideoItem;