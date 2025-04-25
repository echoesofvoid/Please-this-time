import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AdminAuth from '../../components/AdminAuth';
import ChaptersList from '../../components/ChaptersList';

export default function AdminChapters() {
  const router = useRouter();
  
  return (
    <Layout title="Admin - Chapters">
      <AdminAuth>
        <div className="admin-header">
          <h2>Manage Chapters</h2>
          <div className="admin-actions">
            <button 
              onClick={() => router.push('/admin')}
              className="btn btn-secondary"
            >
              Back to Admin
            </button>
          </div>
        </div>
        
        <ChaptersList isAdmin={true} />
      </AdminAuth>
    </Layout>
  );
}
