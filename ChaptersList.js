import { useState, useEffect } from 'react';
import Link from 'next/link';
import { chaptersService } from '../firebase';
import { generateChapterId, parseChapterNumber } from '../firebase/utils';

export default function ChaptersList({ isAdmin = false }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const chaptersPerPage = 12;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const fetchedChapters = await chaptersService.getAllChapters();
        
        // If no chapters exist yet, create placeholder chapters
        if (fetchedChapters.length === 0) {
          const placeholders = Array.from({ length: 59 }, (_, i) => {
            const chapterNumber = i + 1;
            return {
              id: generateChapterId(chapterNumber),
              title: `Chapter ${chapterNumber.toString().padStart(2, '0')}`,
              content: '',
              order: chapterNumber
            };
          });
          setChapters(placeholders);
        } else {
          setChapters(fetchedChapters);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(chapter => 
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate chapters
  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = filteredChapters.slice(indexOfFirstChapter, indexOfLastChapter);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredChapters.length / chaptersPerPage);

  if (loading) {
    return <div className="text-center">Loading chapters...</div>;
  }

  return (
    <div>
      <h2>Chapters</h2>
      <p className="text-center">
        Browse all chapters of "Chronicles of Magic and Machine" from Chapter 01 to Chapter 59. 
        {isAdmin ? ' Click on any chapter to add or edit content.' : ''}
      </p>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search chapters..."
          className="form-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>
      
      <div className="grid">
        {currentChapters.map((chapter) => (
          <Link 
            href={isAdmin ? `/admin/chapters/${chapter.id}` : `/chapters/${chapter.id}`}
            key={chapter.id}
          >
            <div className="card chapter-card">
              <h3>{chapter.title}</h3>
              <p>{chapter.content ? 'View chapter' : 'Click to add content'}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} mx-1`}
            >
              {i + 1}
            </button>
          ))}
          
          {currentPage < totalPages && (
            <button
              onClick={() => paginate(currentPage + 1)}
              className="btn btn-secondary mx-1"
            >
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
