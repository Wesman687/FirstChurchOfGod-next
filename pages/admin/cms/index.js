import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { useSelector } from 'react-redux';

export default function PageBuilder() {
  const user = useSelector((state) => state.user);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPages = useCallback(async () => {
    if (!user?.isAdmin) return;
    
    try {
      const response = await fetch('/api/pages');

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        // Handle both formats: direct array or { success: true, pages: [] }
        const pagesArray = data.pages || data || [];
        setPages(Array.isArray(pagesArray) ? pagesArray : []);
      } else {
        console.error('Failed to fetch pages');
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log(user)
    if (user?.isAdmin) {
      fetchPages();
    }
  }, [user, fetchPages]);

  const handleDelete = async (pageId) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPages(pages.filter(page => page._id !== pageId));
      } else {
        alert('Error deleting page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Error deleting page');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: '16px'}}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <Layout>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{textAlign: 'center'}}>
            <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '16px'}}>Admins Only Area</h1>
            <p style={{color: '#666', marginBottom: '24px'}}>Please login as admin to access the page builder.</p>
            <Link href="/">
              <button className="submit" style={{padding: '8px 16px', borderRadius: '4px', color: 'white', fontWeight: '500'}}>
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Page Builder - First Church of God</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "128px 0",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "white",
              padding: "128px 0px 0px 0px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#333",
                    margin: "0 0 4px 0",
                  }}
                >
                  Page Builder
                </h1>
                <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                  Create and manage website pages
                </p>
              </div>
              <Link href="/admin/cms/new">
                <button
                  className="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  + Add New Page
                </button>
              </Link>
            </div>
          </div>

          {/* Pages List */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {(!pages || !Array.isArray(pages) || pages.length === 0) ? (
              <div style={{ textAlign: "center", padding: "128px 0" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 16px",
                    color: "#999",
                  }}
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  No pages yet
                </h3>
                <p style={{ color: "#666", marginBottom: "24px" }}>
                  Create your first page to get started.
                </p>
                <Link href="/admin/cms/new">
                  <button
                    className="submit"
                    style={{
                      padding: "12px 24px",
                      borderRadius: "4px",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    Create Your First Page
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <div
                  style={{ padding: "24px", borderBottom: "1px solid #e9ecef" }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#333",
                      margin: 0,
                    }}
                  >
                    Your Pages ({Array.isArray(pages) ? pages.length : 0})
                  </h2>
                </div>
                {Array.isArray(pages) && pages.map((page) => (
                  <div
                    key={page._id}
                    style={{
                      padding: "24px",
                      borderBottom: "1px solid #f1f3f4",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#333",
                            margin: "0 0 4px 0",
                          }}
                        >
                          {page.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginTop: "4px",
                          }}
                        >
                          <span style={{ fontSize: "14px", color: "#666" }}>
                            /{page.slug}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              padding: "2px 8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              borderRadius: "12px",
                              backgroundColor:
                                page.status === "published"
                                  ? "#d4edda"
                                  : "#fff3cd",
                              color:
                                page.status === "published"
                                  ? "#155724"
                                  : "#856404",
                            }}
                          >
                            {page.status}
                          </span>
                          {page.nav?.showInNav && (
                            <span
                              style={{ fontSize: "12px", color: "#007bff" }}
                            >
                              In Navigation
                            </span>
                          )}
                          <span style={{ fontSize: "12px", color: "#999" }}>
                            Updated {formatDate(page.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <Link href={`/admin/cms/edit/${page._id}`}>
                          <button
                            style={{
                              color: "#007bff",
                              fontWeight: "500",
                              fontSize: "14px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        </Link>
                        <Link href={`/cms/${page.slug}`}>
                          <button
                            style={{
                              color: "#28a745",
                              fontWeight: "500",
                              fontSize: "14px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id)}
                          style={{
                            color: "#dc3545",
                            fontWeight: "500",
                            fontSize: "14px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
