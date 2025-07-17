import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Eye, Lock } from "lucide-react";

interface NotesPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteData: {
    id: number;
    label: "Note" | "Formula" | "Derivation";
    chapterName: string;
    subjectName: string;
    goals: string[];
    cost: string;
    preview: {
      description: string;
      topics: string[];
      sampleContent: string;
      totalPages: number;
      previewPages: number;
    };
  } | null;
  onPurchase: () => void;
}

export default function NotesPreviewModal({ 
  isOpen, 
  onClose, 
  noteData, 
  onPurchase 
}: NotesPreviewModalProps) {
  if (!noteData) return null;

  const isFree = noteData.cost === "Free";

  const getLabelColor = () => {
    switch (noteData.label) {
      case "Note":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Formula":
        return "bg-green-50 text-green-700 border-green-200";
      case "Derivation":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`${getLabelColor()} font-medium`}>
                  {noteData.label}
                </Badge>
                <span className="text-lg font-semibold text-gray-900">
                  {noteData.cost}
                </span>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {noteData.chapterName}
              </DialogTitle>
              <p className="text-gray-600 mb-3">{noteData.subjectName}</p>
              <div className="flex flex-wrap gap-2">
                {noteData.goals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {noteData.preview.description}
              </p>
            </div>

            {/* Topics Covered */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {noteData.preview.topics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="h-1.5 w-1.5 bg-[#F26B1D] rounded-full"></div>
                    <span className="text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Content Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Content Preview</h3>
                <span className="text-sm text-gray-500">
                  {noteData.preview.previewPages} of {noteData.preview.totalPages} pages
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {noteData.preview.sampleContent}
                  </div>
                </div>
                
                {!isFree && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">Full content available after purchase</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F26B1D]">{noteData.preview.totalPages}</div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F26B1D]">{noteData.preview.topics.length}</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F26B1D]">PDF</div>
                <div className="text-sm text-gray-600">Format</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F26B1D]">
                  {isFree ? "Free" : "Premium"}
                </div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Close Preview
            </Button>
            <Button
              onClick={onPurchase}
              className="flex-1 bg-[#F26B1D] hover:bg-[#D72638] text-white font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              {isFree ? "Download Free" : `Purchase for ${noteData.cost}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}