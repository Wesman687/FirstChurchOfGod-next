import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { fetchVideos } from '@/utils/videoService';
import Layout from '@/components/Layout';

const VideoDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetchVideos().then(data => {
      const found = data.find(v => v._id === id);
      setVideo(found);
      if (found) {
        fetch(`/api/videos/${found._id}/trackView`, { method: 'POST' });
      }
    });
  }, [id]);

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  };

  const jumpToTime = (timeStr) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseTimeToSeconds(timeStr);
      videoRef.current.play();
    }
  };

  if (!video) return <p className="videos-container">Loading...</p>;

  return (
    <Layout>
    <div className="videos-container">

      <main className="video-main">
        <h1 className="video-title">{video.title}</h1>

        <video className="video-player-box" ref={videoRef} controls src={video.video_url} />

        <div className="video-metadata">
          <p className="video-paragraph"><strong>Author:</strong> {video.author}</p>
          <p className="video-paragraph"><strong>Short Description:</strong> {video.short_description}</p>

          <h3 className="section-title">People Mentions</h3>
          <ul className="video-list">
            {video.people_mentions.map((mention, idx) => (
              <li
                key={idx}
                className={mention.start_time ? 'clickable' : ''}
                onClick={() => mention.start_time && jumpToTime(mention.start_time)}
              >
                {mention.name} ({mention.mention_type}) - {mention.context}
                {mention.start_time && ` (${mention.start_time} - ${mention.end_time || ''})`}
              </li>
            ))}
          </ul>

          <h3 className="section-title">Prayer Requests</h3>
          <ul className="video-list">
            {video.prayer_requests.map((req, idx) => (
              <li key={idx}>{req.who}: {req.what}</li>
            ))}
          </ul>

          <h3 className="section-title">Scriptures</h3>
          <ul className="video-list">
            {video.scriptures.map((scripture, idx) => (
              <li
                key={idx}
                className={scripture.start_time ? 'clickable' : ''}
                onClick={() => scripture.start_time && jumpToTime(scripture.start_time)}
              >
                {scripture.scripture} ({scripture.start_time} - {scripture.end_time || ''}): {scripture.quote}
                <p>Context: {scripture.context}</p>
              </li>
            ))}
          </ul>

          <h3 className="section-title">Sections</h3>
          <ul className="video-list">
            {video.sections.map((section, idx) => (
              <li
                key={idx}
                className={section.start_time ? 'clickable' : ''}
                onClick={() => section.start_time && jumpToTime(section.start_time)}
              >
                {section.label} ({section.start_time} - {section.end_time || ''})
              </li>
            ))}
          </ul>

          <p className="video_preview_full_description">
            <strong>Full Description:</strong> {video.description}
          </p>
        </div>
      </main>
    </div>
    </Layout>
  );
};

export default VideoDetailPage;