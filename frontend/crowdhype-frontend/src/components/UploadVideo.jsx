import { createSignal } from "solid-js";

function UploadVideo() {
    // Signals to hold upload form data
    const [title, setTitle] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [file, setFile] = createSignal(null);
    
    // handler for form submission
    const handleUpload = async (e) => {
        e.preventDefault();

        // Quick check to ensure user selected a file
        if (!file()) {
            console.error("No file selected!");
            return;
        }

        // Build Formdata
        const formData = new FormData();
        formData.append("title", title());
        formData.append("description", description());
        // This field needs to match what our backend wants
        formData.append("video_file", file());

        try {
            const response = await fetch("http://127.0.0.1:8000/api/videos/", {
            method: "POST",
            body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload video");
            }

            // parse new video data from response
            const newVideo = await response.json();
            console.log("Upload successful: ", newVideo);

            // Reset form fields
            setTitle("");
            setDescription("");
            setFile(null);
        } catch (error) {
            console.error("Error uploading video: ", error);
        }
    };

    return (
        <form onSubmit={handleUpload} style={{ marginBottom: "1em" }}>
            <div>
                <label>Title: </label>
                <input
                    type="text"
                    value={title()}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                    required
                />
            </div>

            <div>
                <label>Description: </label>
                <textarea
                    value={description()}
                    onInput={(e) => setDescription(e.currentTarget.value)}
                />
            </div>
                <label>Video File: </label>
                <input
                    type="file"
                    onChange={(e) => setFile(e.currentTarget.files[0])}
                    required
                />

            <button type="submit">Upload Video</button>
        </form>
    );
}

export default UploadVideo;
            






