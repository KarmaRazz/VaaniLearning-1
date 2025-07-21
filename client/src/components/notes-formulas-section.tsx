import { Button } from "@/components/ui/button";
import NotesPageCard from "@/components/NotesPageCard";
import { getNotesForHomepage, getFormulasForHomepage } from "@/data/notesData";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Custom Carousel Component with drag/swipe functionality
function Carousel({ 
  children, 
  className = "", 
  itemWidth = 256 // w-64 = 16rem = 256px
}: { 
  children: React.ReactNode[]; 
  className?: string; 
  itemWidth?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, children.length - itemsPerView);

  // Calculate items per view based on container width
  useEffect(() => {
    const calculateItemsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;
        const newItemsPerView = Math.floor((containerWidth - 64) / (itemWidth + 24)); // 64px for padding, 24px for gap
        setItemsPerView(Math.max(1, newItemsPerView));
      }
    };

    calculateItemsPerView();
    window.addEventListener('resize', calculateItemsPerView);
    return () => window.removeEventListener('resize', calculateItemsPerView);
  }, [itemWidth]);

  // Adjust currentIndex when itemsPerView changes
  useEffect(() => {
    const newMaxIndex = Math.max(0, children.length - itemsPerView);
    if (currentIndex > newMaxIndex) {
      setCurrentIndex(newMaxIndex);
    }
  }, [itemsPerView, children.length, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  // Mouse events for drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = startX - e.clientX;
    // Drag threshold for navigation
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch events for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling during touch
    if (isDragging) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const x = e.changedTouches[0].clientX;
    const diff = startX - x;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg rounded-full p-2 transition-all duration-200"
        style={{ marginLeft: '-20px' }}
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        disabled={currentIndex >= maxIndex}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg rounded-full p-2 transition-all duration-200"
        style={{ marginRight: '-20px' }}
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing focus:outline-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Notes carousel"
      >
        <div
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (itemWidth + 24)}px)`,
            width: `${children.length * (itemWidth + 24)}px`
          }}
        >
          {children.map((child, index) => (
            <div key={index} className="flex-shrink-0" style={{ width: `${itemWidth}px` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  const handleGetAdd = async (id: number) => {
    try {
      const response = await fetch(`/api/notes/add/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add note to dashboard');
      }

      const result = await response.json();
      
      // Show success message
      alert('Note added to dashboard successfully!');
    } catch (error) {
      console.error('Error adding note to dashboard:', error);
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Access token required')) {
          alert('Please login to add notes to your dashboard');
          // Redirect to login page
          window.location.href = '/login';
        } else {
          alert(error.message);
        }
      } else {
        alert('Failed to add note to dashboard');
      }
    }
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
          
          {/* Carousel container for notes */}
          <div className="mb-8 px-8">
            {notesLoading ? (
              <div className="flex gap-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : notesData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No notes available yet</p>
                <p className="text-gray-500">Notes will appear here once added by the admin</p>
              </div>
            ) : (
              <Carousel className="pb-4">
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
              </Carousel>
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
          
          {/* Carousel container for formulas */}
          <div className="mb-8 px-8">
            {formulasLoading ? (
              <div className="flex gap-6 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : formulasData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No formulas available yet</p>
                <p className="text-gray-500">Formulas and derivations will appear here once added by the admin</p>
              </div>
            ) : (
              <Carousel className="pb-4">
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
              </Carousel>
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