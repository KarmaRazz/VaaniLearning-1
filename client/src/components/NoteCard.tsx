import { Button } from "@/components/ui/button";

interface NoteCardProps {
  chapterName: string;
  subject: string;
  goal: string[];
  type: string;
  price: string;
  buttonLabel: string;
}

export default function NoteCard({ 
  chapterName, 
  subject, 
  goal, 
  type, 
  price, 
  buttonLabel 
}: NoteCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#F26B1D] bg-orange-50 px-2 py-1 rounded-full">
              {type}
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {price}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {chapterName}
          </h3>
          <p className="text-sm text-gray-600">
            {subject}
          </p>
        </div>

        {/* Goals */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-2">
            {goal.map((goalItem, index) => (
              <span 
                key={index}
                className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md"
              >
                {goalItem}
              </span>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Button 
            className="w-full bg-[#F26B1D] hover:bg-[#D72638] text-white font-medium transition-colors duration-200"
            size="sm"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}