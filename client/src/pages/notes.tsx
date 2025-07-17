import { useState } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotesPageCard from "@/components/NotesPageCard";
import NotesPreviewModal from "@/components/NotesPreviewModal";
import { Search } from "lucide-react";

// Placeholder data for goals
const goals = ["CEE", "IOE", "Lok Sewa", "ACCA", "Language"];

// Placeholder data for subjects by goal
const subjectsByGoal: { [key: string]: string[] } = {
  "CEE": ["Physics", "Chemistry", "Zoology", "Botany", "Math"],
  "IOE": ["Physics", "Chemistry", "Math", "English"],
  "Lok Sewa": ["General Knowledge", "Current Affairs", "Nepal History", "Geography", "Constitution"],
  "ACCA": ["Financial Accounting", "Management Accounting", "Corporate Law", "Taxation"],
  "Language": ["English Grammar", "Vocabulary", "Comprehension", "Writing Skills"]
};

// Placeholder data for notes with preview content
const notesData = [
  {
    id: 1,
    label: "Note" as const,
    chapterName: "Optics",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free",
    preview: {
      description: "Comprehensive notes covering all aspects of optics including reflection, refraction, lenses, and optical instruments. Perfect for CEE and IOE preparation.",
      topics: ["Reflection of Light", "Refraction and Snell's Law", "Lenses and Mirror Formula", "Optical Instruments", "Wave Optics", "Interference and Diffraction"],
      sampleContent: "Chapter 1: Reflection of Light\n\nWhen light falls on a surface, it can undergo reflection. The laws of reflection state:\n\n1. The incident ray, reflected ray, and normal all lie in the same plane\n2. The angle of incidence equals the angle of reflection\n\nTypes of Reflection:\n• Regular Reflection: Occurs on smooth surfaces\n• Irregular Reflection: Occurs on rough surfaces\n\nApplications:\n- Plane mirrors\n- Curved mirrors (concave and convex)\n- Periscopes and kaleidoscopes",
      totalPages: 45,
      previewPages: 3
    }
  },
  {
    id: 2,
    label: "Note" as const,
    chapterName: "Organic Chemistry",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹199",
    preview: {
      description: "Detailed organic chemistry notes covering nomenclature, reactions, and mechanisms. Essential for CEE medical entrance preparation.",
      topics: ["Nomenclature", "Hydrocarbons", "Functional Groups", "Reaction Mechanisms", "Stereochemistry", "Biomolecules"],
      sampleContent: "Chapter 1: Introduction to Organic Chemistry\n\nOrganic chemistry is the study of carbon compounds. Carbon's unique properties:\n\n• Tetravalency: Carbon can form 4 bonds\n• Catenation: Ability to form chains\n• Multiple bonding: Can form single, double, triple bonds\n\nTypes of Organic Compounds:\n1. Aliphatic compounds\n2. Aromatic compounds\n3. Heterocyclic compounds\n\n[Full content available after purchase]",
      totalPages: 67,
      previewPages: 5
    }
  },
  {
    id: 3,
    label: "Note" as const,
    chapterName: "Cell Biology",
    subjectName: "Zoology",
    goals: ["CEE"],
    cost: "Free",
    preview: {
      description: "Complete cell biology notes covering cell structure, organelles, and cellular processes for medical entrance exams.",
      topics: ["Cell Theory", "Cell Organelles", "Cell Division", "Cell Membrane", "Cellular Respiration", "Photosynthesis"],
      sampleContent: "Chapter 1: Cell Theory\n\nThe cell theory consists of three main principles:\n\n1. All living things are composed of cells\n2. The cell is the basic unit of life\n3. All cells arise from pre-existing cells\n\nCell Types:\n• Prokaryotic cells (bacteria)\n• Eukaryotic cells (plants, animals)\n\nKey Differences:\n- Nucleus: Present in eukaryotes, absent in prokaryotes\n- Organelles: Membrane-bound organelles only in eukaryotes",
      totalPages: 52,
      previewPages: 4
    }
  },
  {
    id: 4,
    label: "Note" as const,
    chapterName: "Trigonometry",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹149",
    preview: {
      description: "Comprehensive trigonometry notes with formulas, identities, and solved examples for engineering and medical entrance exams.",
      topics: ["Trigonometric Ratios", "Trigonometric Identities", "Inverse Functions", "Heights and Distances", "Trigonometric Equations"],
      sampleContent: "Chapter 1: Basic Trigonometric Ratios\n\nFor a right-angled triangle with angle θ:\n\nsin θ = opposite/hypotenuse\ncos θ = adjacent/hypotenuse\ntan θ = opposite/adjacent\n\nReciprocal Ratios:\ncosec θ = 1/sin θ\nsec θ = 1/cos θ\ncot θ = 1/tan θ\n\n[Complete formulas and examples available after purchase]",
      totalPages: 38,
      previewPages: 3
    }
  },
  {
    id: 5,
    label: "Note" as const,
    chapterName: "Current Affairs",
    subjectName: "General Knowledge",
    goals: ["Lok Sewa"],
    cost: "Free",
    preview: {
      description: "Latest current affairs compilation for Lok Sewa examination covering national and international events, government policies, and important appointments.",
      topics: ["National Politics", "International Relations", "Economic Policies", "Sports Updates", "Awards and Honors", "Government Schemes"],
      sampleContent: "Current Affairs - January 2025\n\nNational Updates:\n• New budget allocation for education sector\n• Infrastructure development projects launched\n• Policy changes in agriculture sector\n\nInternational News:\n• Climate change summit outcomes\n• Trade agreements with neighboring countries\n• Global economic trends affecting Nepal\n\nImportant Appointments:\n• New governors appointed in various provinces",
      totalPages: 28,
      previewPages: 5
    }
  },
  {
    id: 6,
    label: "Note" as const,
    chapterName: "Plant Biology",
    subjectName: "Botany",
    goals: ["CEE"],
    cost: "₹99",
    preview: {
      description: "Detailed plant biology notes covering plant anatomy, physiology, and reproduction for medical entrance preparation.",
      topics: ["Plant Anatomy", "Photosynthesis", "Plant Hormones", "Reproduction", "Plant Diseases", "Economic Botany"],
      sampleContent: "Chapter 1: Plant Cell Structure\n\nPlant cells have unique features:\n\n• Cell Wall: Provides structural support\n• Chloroplasts: Site of photosynthesis\n• Large Vacuole: Maintains turgor pressure\n\nCell Wall Composition:\n- Primary wall: Cellulose, hemicellulose, pectin\n- Secondary wall: Lignin for additional strength\n\n[Full content available after purchase]",
      totalPages: 41,
      previewPages: 4
    }
  }
];

// Placeholder data for formulas and derivations with preview content
const formulasData = [
  {
    id: 7,
    label: "Formula" as const,
    chapterName: "Newton's Laws",
    subjectName: "Physics",
    goals: ["CEE", "IOE"],
    cost: "Free",
    preview: {
      description: "Complete compilation of Newton's laws of motion with formulas, derivations, and practical applications.",
      topics: ["First Law of Motion", "Second Law of Motion", "Third Law of Motion", "Applications", "Problem Solving"],
      sampleContent: "Newton's Laws of Motion - Formula Sheet\n\nFirst Law (Law of Inertia):\nAn object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.\n\nSecond Law:\nF = ma\nWhere: F = Force, m = mass, a = acceleration\n\nThird Law:\nFor every action, there is an equal and opposite reaction.\nF₁₂ = -F₂₁",
      totalPages: 15,
      previewPages: 3
    }
  },
  {
    id: 8,
    label: "Derivation" as const,
    chapterName: "Thermodynamics",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹99",
    preview: {
      description: "Step-by-step derivations of thermodynamic equations including ideal gas law, enthalpy, and entropy calculations.",
      topics: ["Ideal Gas Law", "First Law of Thermodynamics", "Enthalpy", "Entropy", "Gibbs Free Energy"],
      sampleContent: "Derivation: Ideal Gas Law\n\nStarting from Boyle's Law and Charles's Law:\n\nBoyle's Law: PV = constant (at constant T)\nCharles's Law: V/T = constant (at constant P)\n\nCombining these relationships:\nPV/T = constant\n\nFor n moles of gas:\nPV = nRT\n\n[Complete derivations available after purchase]",
      totalPages: 22,
      previewPages: 2
    }
  },
  {
    id: 9,
    label: "Formula" as const,
    chapterName: "Calculus Basics",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹179",
    preview: {
      description: "Essential calculus formulas covering differentiation, integration, and their applications for entrance exams.",
      topics: ["Differentiation Rules", "Integration Formulas", "Limits", "Applications", "Solved Examples"],
      sampleContent: "Basic Differentiation Formulas:\n\nd/dx(xⁿ) = nxⁿ⁻¹\nd/dx(sin x) = cos x\nd/dx(cos x) = -sin x\nd/dx(eˣ) = eˣ\nd/dx(ln x) = 1/x\n\nProduct Rule: d/dx(uv) = u'v + uv'\nQuotient Rule: d/dx(u/v) = (u'v - uv')/v²\n\n[Complete formula sheet available after purchase]",
      totalPages: 18,
      previewPages: 2
    }
  },
  {
    id: 10,
    label: "Derivation" as const,
    chapterName: "Electromagnetic Theory",
    subjectName: "Physics",
    goals: ["IOE"],
    cost: "Free",
    preview: {
      description: "Detailed derivations of electromagnetic equations including Maxwell's equations and wave equations.",
      topics: ["Coulomb's Law", "Electric Field", "Magnetic Field", "Maxwell's Equations", "Electromagnetic Waves"],
      sampleContent: "Derivation: Electric Field due to Point Charge\n\nFrom Coulomb's Law:\nF = kq₁q₂/r²\n\nElectric field E is force per unit charge:\nE = F/q₂ = kq₁/r²\n\nIn vector form:\nE⃗ = (kq/r²)r̂\n\nWhere k = 1/(4πε₀) = 9 × 10⁹ N⋅m²/C²",
      totalPages: 25,
      previewPages: 4
    }
  },
  {
    id: 11,
    label: "Formula" as const,
    chapterName: "Probability",
    subjectName: "Math",
    goals: ["CEE", "IOE"],
    cost: "₹129",
    preview: {
      description: "Comprehensive probability formulas including permutations, combinations, and probability distributions.",
      topics: ["Basic Probability", "Permutations", "Combinations", "Conditional Probability", "Probability Distributions"],
      sampleContent: "Probability Formulas:\n\nBasic Probability:\nP(A) = Number of favorable outcomes / Total number of outcomes\n\nPermutations:\nP(n,r) = n!/(n-r)!\n\nCombinations:\nC(n,r) = n!/(r!(n-r)!)\n\nConditional Probability:\nP(A|B) = P(A∩B)/P(B)\n\n[Complete formulas available after purchase]",
      totalPages: 16,
      previewPages: 2
    }
  },
  {
    id: 12,
    label: "Derivation" as const,
    chapterName: "Acid-Base Equilibrium",
    subjectName: "Chemistry",
    goals: ["CEE"],
    cost: "₹89",
    preview: {
      description: "Step-by-step derivations of acid-base equilibrium equations including pH, pOH, and buffer calculations.",
      topics: ["pH and pOH", "Acid Dissociation", "Buffer Solutions", "Henderson-Hasselbalch", "Titration Curves"],
      sampleContent: "Derivation: pH Formula\n\nFor water dissociation:\nH₂O ⇌ H⁺ + OH⁻\n\nKw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25°C\n\nTaking negative logarithm:\n-log(Kw) = -log[H⁺] - log[OH⁻]\n14 = pH + pOH\n\n[Complete derivations available after purchase]",
      totalPages: 19,
      previewPages: 3
    }
  }
];

export default function Notes() {
  const [selectedGoal, setSelectedGoal] = useState<string>("CEE");
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [contentType, setContentType] = useState<"notes" | "formulas">("notes");
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [selectedNoteForPreview, setSelectedNoteForPreview] = useState<any>(null);

  const handleGoalClick = (goal: string) => {
    setSelectedGoal(goal);
    // Reset subject to first subject of the selected goal
    const subjects = subjectsByGoal[goal];
    if (subjects && subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleView = (id: number) => {
    const currentData = contentType === "notes" ? notesData : formulasData;
    const noteToPreview = currentData.find(item => item.id === id);
    if (noteToPreview) {
      setSelectedNoteForPreview(noteToPreview);
      setPreviewModalOpen(true);
    }
  };

  const handleGetAdd = (id: number) => {
    console.log("Get/Add clicked for item:", id);
    // Add purchase/download logic here
  };

  const handlePurchase = () => {
    if (selectedNoteForPreview) {
      console.log("Purchasing/downloading:", selectedNoteForPreview.chapterName);
      // Add actual purchase/download logic here
      setPreviewModalOpen(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewModalOpen(false);
    setSelectedNoteForPreview(null);
  };

  // Get available subjects for selected goal
  const availableSubjects = selectedGoal ? subjectsByGoal[selectedGoal] || [] : [];

  // Filter data based on selected goal, subject, search query, and content type
  const currentData = contentType === "notes" ? notesData : formulasData;
  
  const filteredData = currentData.filter(item => {
    const matchesGoal = item.goals.includes(selectedGoal);
    const matchesSubject = item.subjectName === selectedSubject;
    const matchesSearch = searchQuery === "" || 
      item.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.goals.some(goal => goal.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesGoal && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF7F3' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#F26B1D' }}>
            Study Notes
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Access comprehensive notes and formulas for your exam preparation
          </p>
        </div>

        {/* Goal Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {goals.map((goal) => (
            <Button
              key={goal}
              variant={selectedGoal === goal ? "default" : "outline"}
              onClick={() => handleGoalClick(goal)}
              className={`px-6 py-2 font-medium transition-colors duration-200 ${
                selectedGoal === goal
                  ? "bg-[#F26B1D] text-white hover:bg-[#D72638]"
                  : "border-[#F26B1D] text-[#F26B1D] hover:bg-[#F26B1D] hover:text-white"
              }`}
            >
              {goal}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search chapters, subjects, or goals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-gray-300 focus:border-[#F26B1D] focus:ring-[#F26B1D]"
            />
          </div>
        </div>

        {/* Subject Tabs and Content Type Toggle */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          
          {/* Subject Tabs - Horizontally Scrollable */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "ghost"}
                  onClick={() => handleSubjectClick(subject)}
                  className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedSubject === subject
                      ? "bg-[#D72638] text-white hover:bg-[#F26B1D]"
                      : "text-gray-600 hover:text-[#F26B1D] hover:bg-gray-100"
                  }`}
                >
                  {subject}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={contentType === "notes" ? "default" : "ghost"}
              onClick={() => setContentType("notes")}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                contentType === "notes"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Notes
            </Button>
            <Button
              variant={contentType === "formulas" ? "default" : "ghost"}
              onClick={() => setContentType("formulas")}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                contentType === "formulas"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Formulas & Derivations
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredData.map((item) => (
            <NotesPageCard
              key={item.id}
              label={item.label}
              chapterName={item.chapterName}
              subjectName={item.subjectName}
              goals={item.goals}
              cost={item.cost}
              onView={() => handleView(item.id)}
              onGetAdd={() => handleGetAdd(item.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {contentType} found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search for different content.
              </p>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        <NotesPreviewModal
          isOpen={previewModalOpen}
          onClose={handleClosePreview}
          noteData={selectedNoteForPreview}
          onPurchase={handlePurchase}
        />
      </div>
    </div>
  );
}
