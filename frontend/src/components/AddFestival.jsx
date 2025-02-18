import { createSignal } from "solid-js";
import { postData } from "~/lib/api";

export default function AddFestival({ onClose, onFestivalAdded }) {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [image, setImage] = createSignal(null);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name());
    formData.append("description", description());
    formData.append("start_date", startDate());
    formData.append("end_date", endDate());
    formData.append("location", location());
    if (image()) {
      formData.append("image", image());
    }

    try {
      const newFestival = await postData("festivals", formData, "POST", true);
      onFestivalAdded(newFestival);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl relative">
        {/* Close Button */}
        <button class="absolute top-3 right-3 text-2xl text-gray-500 hover:text-red-500" onClick={onClose}>
          &times;
        </button>

        <h2 class="text-2xl font-semibold text-center mb-4">Add Festival</h2>

        <form onSubmit={handleSubmit}>
          <label class="block font-semibold mb-1">Festival Name:</label>
          <input type="text" class="w-full p-2 border rounded mb-4" value={name()} onInput={(e) => setName(e.target.value)} required />

          <label class="block font-semibold mb-1">Start Date:</label>
          <input type="date" class="w-full p-2 border rounded mb-4" value={startDate()} onInput={(e) => setStartDate(e.target.value)} required />

          <label class="block font-semibold mb-1">End Date:</label>
          <input type="date" class="w-full p-2 border rounded mb-4" value={endDate()} onInput={(e) => setEndDate(e.target.value)} required />

          <label class="block font-semibold mb-1">Location:</label>
          <input type="text" class="w-full p-2 border rounded mb-4" value={location()} onInput={(e) => setLocation(e.target.value)} required />

          <label class="block font-semibold mb-1">Description:</label>
          <textarea class="w-full p-2 border rounded mb-4" value={description()} onInput={(e) => setDescription(e.target.value)} required />

          <label class="block font-semibold mb-1">Image:</label>
          <input type="file" class="w-full p-2 border rounded mb-4" onChange={(e) => setImage(e.target.files[0])} />

          <button type="submit" class="w-full px-5 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition">
            Add Festival
          </button>
        </form>
      </div>
    </div>
  );
}
