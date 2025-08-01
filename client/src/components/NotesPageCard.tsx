import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/hooks/use-auth-modal";

interface NotesPageCardProps {
  label: "Note" | "Formula" | "Derivation";
  chapterName: string;
  subjectName: string;
  goals: string[];
  cost: string;
  noteId?: string;
  onView: () => void;
  onGetAdd: () => void;
}

export default function NotesPageCard({
  label,
  chapterName,
  subjectName,
  goals,
  cost,
  noteId,
  onView,
  onGetAdd
}: NotesPageCardProps) {
  const { user } = useAuth();
  const { showAuthModal } = useAuthModal();

  const handleView = () => {
    if (!user) {
      // Store current page and note info for redirect after login
      const currentUrl = `/notes${window.location.search}`;
      showAuthModal(currentUrl, noteId);
      return;
    }
    onView();
  };

  const handleAddToDashboard = () => {
    if (!user) {
      // Store current page and note info for redirect after login
      const currentUrl = `/notes${window.location.search}`;
      showAuthModal(currentUrl, noteId);
      return;
    }
    onGetAdd();
  };
  const getLabelColor = () => {
    switch (label) {
      case "Note":
        return "bg-blue-50 text-blue-700";
      case "Formula":
        return "bg-green-50 text-green-700";
      case "Derivation":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const isFree = cost === "Free";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {/* Label and Cost */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLabelColor()}`}>
            {label}
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {cost}
          </span>
        </div>

        {/* Chapter Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {chapterName}
        </h3>

        {/* Subject Name */}
        <p className="text-sm text-gray-600 mb-3">
          {subjectName}
        </p>

        {/* Goal Tags */}
        <div className="flex flex-wrap gap-2 mb-4 flex-grow">
          {goals.map((goal, index) => (
            <span 
              key={index}
              className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md"
            >
              {goal}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button 
            variant="outline"
            size="sm"
            className="flex-1 border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
            onClick={handleView}
          >
            View
          </Button>
          <Button 
            size="sm"
            className="flex-1 bg-[#F26B1D] hover:bg-[#D72638] text-white"
            onClick={handleAddToDashboard}
          >
            Add to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}