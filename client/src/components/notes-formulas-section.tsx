import { Button } from "@/components/ui/button";
import NoteCard from "@/components/NoteCard";
import FormulaCard from "@/components/FormulaCard";

// Dummy data for notes
const notesData = [
  {
    chapterName: "Optics",
    subject: "Physics",
    goal: ["CEE", "IOE"],
    type: "Note",
    price: "Free",
    buttonLabel: "Get"
  },
  {
    chapterName: "Organic Chemistry",
    subject: "Chemistry",
    goal: ["CEE"],
    type: "Note",
    price: "₹199",
    buttonLabel: "Add"
  },
  {
    chapterName: "Cell Biology",
    subject: "Biology",
    goal: ["CEE"],
    type: "Note",
    price: "Free",
    buttonLabel: "Get"
  },
  {
    chapterName: "Trigonometry",
    subject: "Mathematics",
    goal: ["CEE", "IOE"],
    type: "Note",
    price: "₹149",
    buttonLabel: "Add"
  },
  {
    chapterName: "Current Affairs",
    subject: "General Knowledge",
    goal: ["Lok Sewa"],
    type: "Note",
    price: "Free",
    buttonLabel: "Get"
  }
];

// Dummy data for formulas/derivations
const formulasData = [
  {
    chapterName: "Newton's Laws",
    subject: "Physics",
    goal: ["CEE", "IOE"],
    type: "Formula",
    price: "Free",
    buttonLabel: "Get"
  },
  {
    chapterName: "Thermodynamics",
    subject: "Chemistry",
    goal: ["CEE"],
    type: "Derivation",
    price: "₹99",
    buttonLabel: "Add"
  },
  {
    chapterName: "Calculus Basics",
    subject: "Mathematics",
    goal: ["CEE", "IOE"],
    type: "Formula",
    price: "₹179",
    buttonLabel: "Add"
  },
  {
    chapterName: "Electromagnetic Theory",
    subject: "Physics",
    goal: ["IOE"],
    type: "Derivation",
    price: "Free",
    buttonLabel: "Get"
  },
  {
    chapterName: "Probability",
    subject: "Mathematics",
    goal: ["CEE", "IOE"],
    type: "Formula",
    price: "₹129",
    buttonLabel: "Add"
  }
];

export default function NotesFormulasSection() {
  return (
    <section className="py-16 bg-[#FDF7F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Chapter Notes Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Chapter Notes
            </h2>
            <p className="text-lg text-[#444444] max-w-2xl mx-auto">
              Get comprehensive chapter-wise notes for all your exam preparations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {notesData.map((note, index) => (
              <NoteCard
                key={index}
                chapterName={note.chapterName}
                subject={note.subject}
                goal={note.goal}
                type={note.type}
                price={note.price}
                buttonLabel={note.buttonLabel}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
            >
              Explore All Notes
            </Button>
          </div>
        </div>

        {/* Formulas & Derivations Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              Formulas & Derivations
            </h2>
            <p className="text-lg text-[#444444] max-w-2xl mx-auto">
              Master essential formulas and step-by-step derivations for quick revision
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {formulasData.map((formula, index) => (
              <FormulaCard
                key={index}
                chapterName={formula.chapterName}
                subject={formula.subject}
                goal={formula.goal}
                type={formula.type}
                price={formula.price}
                buttonLabel={formula.buttonLabel}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-[#D72638] hover:bg-[#F26B1D] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
            >
              Explore All Formulas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}