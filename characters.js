import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminAuth from '../../components/AdminAuth';
import CharactersList from '../../components/CharactersList';

export default function AdminCharacters() {
  const router = useRouter();
  
  return (
    <Layout title="Admin - Characters">
      <AdminAuth>
        <div className="admin-header">
          <h2>Manage Characters</h2>
          <div className="admin-actions">
            <button 
              onClick={() => router.push('/admin')}
              className="btn btn-secondary"
            >
              Back to Admin
            </button>
          </div>
        </div>
        
        <CharactersList isAdmin={true} />
      </AdminAuth>
    </Layout>
  );
}
