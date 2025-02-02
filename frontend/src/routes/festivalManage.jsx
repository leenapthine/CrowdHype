import { useNavigate, useParams } from "@solidjs/router";

export default function FestivalManage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header class="bg-white shadow-md w-full p-4 flex justify-between items-center">
        <div class="leading-none text-left cursor-pointer" onClick={() => navigate("/dashboard")}>
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

      {/* Festival Options */}
      <div class="w-full max-w-lg p-6">
        <button 
          class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200"
          onClick={() => navigate(`/dashboard/festival/${id}/edit`)}
        >
          Edit Festival Info
        </button>
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          Create Request
        </button>
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          View All Submissions
        </button>
        <button class="w-full p-4 border-b text-left text-lg font-semibold hover:bg-gray-200">
          Analytics
        </button>
      </div>
    </div>
  );
}
