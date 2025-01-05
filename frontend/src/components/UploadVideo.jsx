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
        <form 
            onSubmit={handleUpload}
            class="flex flex-col space-y-4 p-4 mb-4 bg-gray-800 rounded-md shadow-md max-w-md"
            >
            <div class="flex flex-col">
                <label class="mb-1 text-sm text-gray-300 font-semibold">Title</label>
                <input
                type="text"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                required
                class="p-2 rounded-sm text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a title..."
                />
            </div>
        
            <div class="flex flex-col">
                <label class="mb-1 text-sm text-gray-300 font-semibold">Description</label>
                <textarea
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                class="p-2 rounded-sm text-gray-200 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a description..."
                />
            </div>
        
            <div class="flex flex-col">
                <label class="mb-1 text-sm text-gray-300 font-semibold">Video File</label>
                <input
                type="file"
                onChange={(e) => setFile(e.currentTarget.files[0])}
                required
                class="text-sm text-gray-200 file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700
                        focus:outline-none"
                />
            </div>
        
            <button
                type="submit"
                class="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Upload Video
            </button>
        </form>
      );
}

export default UploadVideo;
            






