import { Button } from "@/components/ui/button";
import NotesPageCard from "@/components/NotesPageCard";
import { getNotesForHomepage, getFormulasForHomepage } from "@/data/notesData";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function NotesFormulasSection() {
  // Get data from API using React Query
  const { data: notesData = [], isLoading: notesLoading } = useQuery({
    queryKey: ['/api/notes', 'homepage-notes'],
    queryFn: () => getNotesForHomepage(12),
  });

  const { data: formulasData = [], isLoading: formulasLoading } = useQuery({
    queryKey: ['/api/notes', 'homepage-formulas'],
    queryFn: () => getFormulasForHomepage(12),
  });

  // Handler functions
  const handleView = (id: number) => {
    // Find the note/formula with the given id
    const allData = [...notesData, ...formulasData];
    const item = allData.find(note => note.id === id);
    
    if (item && item.driveLink) {
      // Open Google Drive link in new tab
      window.open(item.driveLink, '_blank');
    } else {
      alert('Content link not available');
    }
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
          
          {/* Horizontal scrollable container for notes */}
          <div className="overflow-x-auto pb-4 mb-8">
            {notesLoading ? (
              <div className="flex gap-6 min-w-max">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-6 min-w-max">
                {notesData.map((note) => (
                  <div key={note.id} className="flex-shrink-0 w-64">
                    <NotesPageCard
                      label={note.label}
                      chapterName={note.chapterName}
                      subjectName={note.subjectName}
                      goals={note.goals}
                      cost={note.cost}
                      onView={() => handleView(note.id)}
                      onGetAdd={() => handleGetAdd(note.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link href="/notes">
              <Button 
                className="bg-[#F26B1D] hover:bg-[#D72638] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
              >
                Explore All Notes
              </Button>
            </Link>
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
          
          {/* Horizontal scrollable container for formulas */}
          <div className="overflow-x-auto pb-4 mb-8">
            {formulasLoading ? (
              <div className="flex gap-6 min-w-max">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-6 min-w-max">
                {formulasData.map((formula) => (
                  <div key={formula.id} className="flex-shrink-0 w-64">
                    <NotesPageCard
                      label={formula.label}
                      chapterName={formula.chapterName}
                      subjectName={formula.subjectName}
                      goals={formula.goals}
                      cost={formula.cost}
                      onView={() => handleView(formula.id)}
                      onGetAdd={() => handleGetAdd(formula.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link href="/notes?filter=formulas">
              <Button 
                className="bg-[#D72638] hover:bg-[#F26B1D] text-white px-8 py-3 text-lg font-semibold transition-colors duration-200"
              >
                Explore All Formulas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}