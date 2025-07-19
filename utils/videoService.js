export async function fetchVideos({ search = '', location = '', sort = 'recent' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (sort) params.append('sort', sort);
  
    const res = await fetch(`/api/videos?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    return res.json();
  }
  