import { useNavigate } from "@solidjs/router";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header class="bg-white shadow-md w-full p-4 flex justify-between items-center">
        <div class="leading-none text-left cursor-pointer" 
            onClick={() => navigate("/home")}
            
        >
          <h1 class="text-3xl font-bold">.crowd</h1>
          <h1 class="text-4xl font-bold">HYPE</h1>
        </div>
        <img
          src="/donkey.jpg"
          alt="Avatar"
          class="w-12 h-12 rounded-full cursor-pointer"
          onClick={() => navigate("/profile")}
        />
      </header>

      {/* Festival Cards Section */}
      <div class="w-full max-w-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Festival Cards</h2>
        <div class="grid grid-cols-3 gap-4">
          {/* Example festival cards */}
          <div class="bg-gray-300 w-24 h-24 rounded flex items-center justify-center cursor-pointer">
            <img src="/shamb.png" alt="Shambhala Festival" class="w-full h-full object-cover rounded" />
          </div>
          <div class="bg-gray-300 w-24 h-24 rounded flex items-center justify-center cursor-pointer">
            <img src="/lib.jpg" alt="Lib Festival" class="w-full h-full object-cover rounded" />
          </div>

          {/* Add Festival Button */}
          <div
            class="bg-gray-200 w-24 h-24 rounded flex items-center justify-center text-3xl font-bold cursor-pointer hover:bg-gray-300"
            onClick={() => console.log("Add Festival Clicked")}
          >
            +
          </div>
        </div>
      </div>

      {/* Promoter Options */}
      <div class="w-full max-w-lg">
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          View Submissions
        </button>
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          Create Request
        </button>
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          Analytics
        </button>
      </div>
    </div>
  );
}
