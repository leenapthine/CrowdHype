import { createSignal, createEffect } from "solid-js";
import { postData } from "~/lib/api";

function UploadVideo( { preloadedVideo}) {
    // Signals to hold upload form data
    const [title, setTitle] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [file, setFile] = createSignal(preloadedVideo || null);
    let fileInputRef;

    // If a preloaded video file is provided, set it
    createEffect(() => {
        if (preloadedVideo) {
            console.log("Preloaded Video Detected:", preloadedVideo);
            setFile(preloadedVideo);
        }
    });
    
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
            const newVideo = await postData("videos", formData, true);
            console.log("Upload successful: ", newVideo);

            // Reset form fields
            setTitle("");
            setDescription("");
            setFile(null);
            if (fileInputRef) fileInputRef.value = "";
        } catch (error) {
            console.error("Error uploading video: ", error);
        }
    };

    return (
        <form 
            onSubmit={handleUpload}
            class="flex flex-col space-y-4 p-4 mb-4 bg-neutral-100 rounded-xl shadow-md"
            >
            <div class="flex flex-col">
                <label class="mb-1 text-sm text-neutral-700 font-semibold">Title</label>
                <input
                type="text"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                required
                class="p-2 rounded-md text-neutral-800 bg-white border border-neutral-300
                        focus:outline-none focus:ring-2 focus:ring-neutral-500"
                placeholder="Enter a title..."
                />
            </div>
        
            <div class="flex flex-col">
                <label class="mb-1 text-sm text-neutral-700 font-semibold">Description</label>
                <textarea
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                class="p-2 rounded-md text-neutral-800 bg-white border border-neutral-300
                        focus:outline-none focus:ring-2 focus:ring-neutral-500"
                placeholder="Enter a description..."
                />
            </div>

            {/* Show File Input Only If No Preloaded Video */}
            {!preloadedVideo && (
                <div class="flex flex-col">
                    <label class="mb-1 text-sm text-neutral-700 font-semibold">Video File</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.currentTarget.files[0])}
                        required
                        class="text-sm text-neutral-800 file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-neutral-500 file:text-white
                                hover:file:bg-neutral-600
                                focus:outline-none
                                border border-neutral-300 rounded-md p-1
                                bg-white"
                    />
                </div>
            )}

            {/* Show a small preview if preloaded video exists */}
            {preloadedVideo && (
                <div class="flex flex-col items-center mb-4">
                    <p class="text-sm text-neutral-700 mb-2">Preloaded Video:</p>
                    <video 
                        controls 
                        class="rounded-md shadow-md max-w-full"
                        src={URL.createObjectURL(preloadedVideo)}
                    ></video>
                </div>
            )}
            
            <button
                type="submit"
                class="py-2 px-4 bg-neutral-500 text-white font-semibold rounded-md
                    hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500
                    transition-colors"
            >
                Upload Video
            </button>
        </form>
    );
}

export default UploadVideo;
