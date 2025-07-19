// pages/videos.js
import React, { useState, useEffect, useRef } from 'react';
import { fetchVideos } from '@/utils/videoService';
import Link from 'next/link';
import {  useRouter } from 'next/router';
import Layout from '@/components/Layout';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [popularVideos, setPopularVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const videoRef = useRef(null);
  const router = useRouter()

  useEffect(() => {
    fetchVideos({ search: searchQuery, location: locationFilter, sort: sortBy })
      .then(data => {
        setVideos(data);
        setFilteredVideos(data);
        setRecentVideos(data.slice(0, 6));
        setPopularVideos([...data].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6));
      })
      .catch(err => console.error(err));
  }, [searchQuery, locationFilter, sortBy]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    fetch(`/api/videos/${video._id}/trackView`, { method: 'POST' });
    router.push(`/videos/${video._id}`);
  };

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  };

  const jumpToTime = (timeStr) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseTimeToSeconds(timeStr);
      videoRef.current.play();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const uniqueLocations = [...new Set(videos.map(v => v.location).filter(Boolean))];

  const VideoList = ({ title, items, seeAllLink }) => (
    <div className="video-category">
      <div className="video-category-header">
        <h2>{title}</h2>
        {seeAllLink && <Link href={seeAllLink}><span className="see-all-link">See All</span></Link>}
      </div>
      <div className="video-list">
        <ul>
          {items.map(video => (
            <li key={video._id} onClick={() => handleSelectVideo(video)}>
              <div className="video-thumbnail">
                <img
                  src={`${video.video_url.replace('.mp4', '')}.thumbnail.jpg`}
                  alt={video.title}
                />
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>By {video.author} | {video.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Layout>
    <div className="videos-container">
      <h1 className="videos-header">Sermon Library</h1>

      <div className="video-controls">
        <input
          type="text"
          placeholder="Search by title, author, or topic"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select value={locationFilter} onChange={handleLocationChange}>
          <option value="">All Locations</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {/* <VideoList title="Most Recent" items={recentVideos} seeAllLink="/videos?sort=recent" />
      <VideoList title="Most Popular" items={popularVideos} seeAllLink="/videos?sort=popular" /> */}

      <div className="video-category">
        <h2 className='video_results'>All Results</h2>
        <div className="video-list">
          <ul>
          {filteredVideos.map(video => (
            <li
              key={video._id}
              onClick={() => window.open(`/videos/${video._id}`, '_blank')}
              className="clickable"
            >
              <div className="video-thumbnail">
                <img
                  src={`${video.video_url.replace('.mp4', '')}.thumbnail.jpg`}
                  alt={video.title}
                />
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p>By {video.author} | {video.location}</p>
              </div>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default VideosPage;