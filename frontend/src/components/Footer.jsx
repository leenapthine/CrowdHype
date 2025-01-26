import { useNavigate } from "@solidjs/router";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      class="fixed bottom-0 left-0 w-full flex justify-around items-center p-4
             bg-black bg-opacity-80 text-white text-sm z-50"
    >
      {/* Search Button (Placeholder) */}
      <button
        onClick={() => console.log("Search clicked")}
        class="flex flex-col items-center text-center hover:text-red-400 transition-colors"
      >
        <span class="text-xl">△</span>
        <span>Search</span>
      </button>

      {/* Saved Videos Link */}
      <button
        onClick={() => navigate("/saved")}
        class="flex flex-col items-center text-center hover:text-red-400 transition-colors"
      >
        <span class="text-xl">♡</span> {/* Outline heart */}
        <span>Saved</span>
      </button>

      {/* Filter Button (Placeholder) */}
      <button
        onClick={() => console.log("Filter clicked")}
        class="flex flex-col items-center text-center hover:text-red-400 transition-colors"
      >
        <span class="text-xl">⦾</span>
        <span>Filter</span>
      </button>
    </footer>
  );
}
