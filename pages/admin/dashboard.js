import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

export default function AdminDashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - First Church of God</title>
      </Head>

            <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Welcome back, {user.displayName || user.email}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Page Builder */}
            <Link href="/admin/cms">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Page Builder</h2>
                    <p className="text-xs text-gray-600">Create pages</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Sermons */}
            <Link href="/admin/sermons">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-green-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-green-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Sermons</h2>
                    <p className="text-xs text-gray-600">Manage content</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Gallery */}
            <Link href="/admin/gallery">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-purple-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-purple-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Gallery</h2>
                    <p className="text-xs text-gray-600">Photo galleries</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Members */}
            <Link href="/admin/members">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-yellow-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-yellow-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Members</h2>
                    <p className="text-xs text-gray-600">Church members</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Prayer Requests */}
            <Link href="/admin/prayer-requests">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-red-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-red-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Prayer Requests</h2>
                    <p className="text-xs text-gray-600">Review requests</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Form Submissions */}
            <Link href="/admin/forms">
              <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-indigo-500 h-20">
                <div className="flex items-center h-full">
                  <div className="bg-indigo-100 p-2 rounded-md">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <h2 className="text-sm font-semibold text-gray-900">Form Submissions</h2>
                    <p className="text-xs text-gray-600">View submissions</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/admin/cms/new">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
                  + Create New Page
                </button>
              </Link>
              <Link href="/admin/sermons/upload">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm">
                  + Upload Sermon
                </button>
              </Link>
              <Link href="/admin/gallery/upload">
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium text-sm">
                  + Add Photos
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
