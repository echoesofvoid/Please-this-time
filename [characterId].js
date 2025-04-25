import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import AdminAuth from '../../../components/AdminAuth';
import CharacterEditor from '../../../components/CharacterEditor';
import { charactersService } from '../../../firebase';

export default function AdminEditCharacter() {
  const router = useRouter();
  const { characterId } = router.query;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!characterId) return;
    
    // If this is a new character, don't fetch
    if (characterId === 'new') {
      setCharacter({
        name: '',
        role: '',
        description: '',
        specialTraits: '',
        relationships: '',
        initial: '',
        imageUrl: '',
        order: 0
      });
      setLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const fetchedCharacter = await charactersService.getCharacter(characterId);
        
        if (fetchedCharacter) {
          setCharacter(fetchedCharacter);
        } else {
          setError('Character not found.');
        }
      } catch (error) {
        console.error('Error fetching character:', error);
        setError('Failed to load character. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (!characterId) {
    return <div>Loading...</div>;
  }

  return (
    <Layout title={`Admin - ${characterId === 'new' ? 'New Character' : `Edit ${character?.name || characterId}`}`}>
      <AdminAuth>
        <div className="admin-header">
          <h2>{characterId === 'new' ? 'Add New Character' : `Edit Character: ${character?.name || characterId}`}</h2>
          <div className="admin-actions">
            <button 
              onClick={() => router.push('/admin/characters')}
              className="btn btn-secondary"
            >
              Back to Characters
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center">Loading character...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <CharacterEditor characterId={characterId} initialData={character} />
        )}
      </AdminAuth>
    </Layout>
  );
}
