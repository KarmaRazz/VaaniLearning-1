import { Button } from "@/components/ui/button";
import NotesPageCard from "@/components/NotesPageCard";
import { getNotesForHomepage, getFormulasForHomepage } from "@/data/notesData";

export default function NotesFormulasSection() {
  // Get data from centralized source
  const notesData = getNotesForHomepage(15); // Show 15 notes
  const formulasData = getFormulasForHomepage(15); // Show 15 formulas

  // Handler functions
  const handleView = (id: number) => {
    console.log("View clicked for item:", id);
    // This can be connected to actual view functionality later
  };

  const handleGetAdd = (id: number) => {
    console.log("Get/Add clicked for item:", id);
    // This can be connected to actual purchase/download functionality later
  };

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
            {notesData.map((note) => (
              <NotesPageCard
                key={note.id}
                label={note.label}
                chapterName={note.chapterName}
                subjectName={note.subjectName}
                goals={note.goals}
                cost={note.cost}
                onView={() => handleView(note.id)}
                onGetAdd={() => handleGetAdd(note.id)}
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
            {formulasData.map((formula) => (
              <NotesPageCard
                key={formula.id}
                label={formula.label}
                chapterName={formula.chapterName}
                subjectName={formula.subjectName}
                goals={formula.goals}
                cost={formula.cost}
                onView={() => handleView(formula.id)}
                onGetAdd={() => handleGetAdd(formula.id)}
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