import { useNavigate } from "@solidjs/router";
import { Dynamic } from "solid-js/web";
import Search from "lucide-react/icons/search";
import Heart from "lucide-react/icons/heart";
import Sliders from "lucide-react/icons/sliders";

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
        class="flex flex-col items-center text-center"
      >
        <Dynamic component={Search} class="text-xl" />
        <span>Search</span>
      </button>

      {/* Saved Videos Link */}
      <button
        onClick={() => navigate("/saved")}
        class="flex flex-col items-center text-center"
      >
        <Dynamic component={Heart} class="text-xl" />
        <span>Saved</span>
      </button>

      {/* Filter Button (Placeholder) */}
      <button
        onClick={() => console.log("Filter clicked")}
        class="flex flex-col items-center text-center"
      >
        <Dynamic component={Sliders} class="text-xl" />
        <span>Filter</span>
      </button>
    </footer>
  );
}
