import { createSignal, onCleanup } from 'solid-js';

export default function CameraPopup({ onClose, onSave }) {
    const [isRecording, setIsRecording] = createSignal(false);
    const [videoFile, setVideoFile] = createSignal(null);
    const [videoURL, setVideoURL] = createSignal(null);
    let videoElement;
    let mediaRecorder;
    let recordedChunks = [];
    let stream;

    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoElement.srcObject = stream;
            videoElement.play();
        } catch (error) {
            console.error('Error accessing camera:', error);
            onClose();
        }
    };

    const startRecording = () => {
        recordedChunks = [];
        try {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          } catch (err) {
            console.warn("Preferred MIME type not supported. Falling back...");
            mediaRecorder = new MediaRecorder(stream);
          }

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
              }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
            setVideoFile(file);

            // Create a local URL so user can preview the recorded video
            setVideoURL(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder?.state === "recording") {
            mediaRecorder.stop();
        }
        // Turn off camera
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
    };

    const handleSave = () => {
        if (videoFile()) {
            onSave(videoFile());
        } 
        onClose();
    };

    onCleanup(() => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        if (videoURL()) {
            URL.revokeObjectURL(videoURL());
        }
    });

    startCamera();

    return (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div class="bg-white shadow-lg rounded-lg p-4 max-w-lg w-full">
            <h2 class="text-lg font-semibold mb-4">Record Your Video</h2>

            <Show when={!videoURL()}>
                {/* Live Camera Preview */}
                <video
                    ref={videoElement}
                    class="w-full h-auto mb-4 border border-neutral-300 rounded"
                    autoplay
                    muted
                ></video>
            </Show>
            
            <Show when={videoURL()}>
                {/* Playback of Recorded Video */}
                <video
                    src={videoURL()}
                    class="w-full h-auto mb-4 border border-neutral-300 rounded"
                    controls
                ></video>
            </Show>

            <div class="flex space-x-4 justify-center">
                {/* Record/Stop Buttons */}
                <Show when={!isRecording() && !videoURL()}>
                    <button
                        onClick={startRecording}
                        class="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Record
                    </button>
                </Show>

                <Show when={isRecording()}>
                    <button
                        onClick={stopRecording}
                        class="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Stop
                    </button>
                </Show>

              <button
                    onClick={onClose}
                    class="py-2 px-4 bg-neutral-500 text-white rounded hover:bg-neutral-600"
              >
                    Cancel
              </button>

              <Show when={videoFile()}>
                    <button
                        onClick={handleSave}
                        class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Save
                    </button>
              </Show>
            </div>
          </div>
        </div>
      );
    }