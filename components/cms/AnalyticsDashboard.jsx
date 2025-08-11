// components/cms/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ formId = null }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [formId, timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const url = formId 
        ? `/api/analytics/forms/${formId}?range=${timeRange}`
        : `/api/analytics/forms?range=${timeRange}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const mockAnalytics = analytics || {
    overview: {
      totalSubmissions: 156,
      submissionsThisPeriod: 23,
      averageCompletionRate: 87.5,
      popularForms: [
        { id: 'contact', name: 'Contact Form', submissions: 45 },
        { id: 'prayer', name: 'Prayer Request', submissions: 32 },
        { id: 'volunteer', name: 'Volunteer Signup', submissions: 28 }
      ]
    },
    trends: {
      daily: [
        { date: '2024-01-01', submissions: 5 },
        { date: '2024-01-02', submissions: 8 },
        { date: '2024-01-03', submissions: 3 },
        { date: '2024-01-04', submissions: 12 },
        { date: '2024-01-05', submissions: 7 },
        { date: '2024-01-06', submissions: 15 },
        { date: '2024-01-07', submissions: 9 }
      ]
    },
    devices: {
      desktop: 65,
      mobile: 28,
      tablet: 7
    },
    conversion: {
      views: 1250,
      starts: 890,
      completions: 780,
      startRate: 71.2,
      completionRate: 87.6
    }
  };

  return (
    <div className="analytics-dashboard">
      <style jsx>{`
        .analytics-dashboard {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .analytics-header {
          display: flex;
          align-items: center;
          justify-content: between;
          margin-bottom: 32px;
        }

        .analytics-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .time-range-selector {
          display: flex;
          gap: 8px;
        }

        .time-btn {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #6b7280;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .time-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .time-btn:hover:not(.active) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .metric-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .metric-title {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          margin: 0;
        }

        .metric-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .metric-change {
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .metric-change.positive {
          color: #059669;
        }

        .metric-change.negative {
          color: #dc2626;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 24px 0;
        }

        .submissions-chart {
          height: 300px;
          display: flex;
          align-items: end;
          gap: 8px;
          padding: 20px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .chart-bar {
          flex: 1;
          background: #3b82f6;
          border-radius: 4px 4px 0 0;
          min-height: 20px;
          position: relative;
        }

        .chart-bar:hover {
          background: #2563eb;
        }

        .device-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .device-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .device-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .device-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .device-name {
          font-weight: 500;
          color: #374151;
        }

        .device-percentage {
          font-weight: 600;
          color: #1f2937;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .popular-forms {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .forms-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .form-item:hover {
          border-color: #e2e8f0;
          background: #f8fafc;
        }

        .form-name {
          font-weight: 500;
          color: #374151;
        }

        .form-submissions {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .submissions-badge {
          background: #eff6ff;
          color: #3b82f6;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
        }

        .analytics-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: #6b7280;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .conversion-funnel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .funnel-step {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 8px;
          background: #f8fafc;
        }

        .funnel-label {
          font-weight: 500;
          color: #374151;
        }

        .funnel-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1f2937;
        }

        .funnel-rate {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>

      <div className="analytics-header">
        <h1 className="analytics-title">
          📊 Form Analytics {formId && `- ${formId}`}
        </h1>
        <div className="time-range-selector">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? 'Last 7 days' : 
               range === '30d' ? 'Last 30 days' : 
               range === '90d' ? 'Last 90 days' : 'Last year'}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Total Submissions</h3>
            <div className="metric-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>
              📝
            </div>
          </div>
          <div className="metric-value">{mockAnalytics.overview.totalSubmissions}</div>
          <div className="metric-change positive">
            <span>↗</span>
            <span>+{mockAnalytics.overview.submissionsThisPeriod} this period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Completion Rate</h3>
            <div className="metric-icon" style={{background: '#f0fdf4', color: '#059669'}}>
              ✅
            </div>
          </div>
          <div className="metric-value">{mockAnalytics.overview.averageCompletionRate}%</div>
          <div className="metric-change positive">
            <span>↗</span>
            <span>+2.3% vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Form Views</h3>
            <div className="metric-icon" style={{background: '#fef3c7', color: '#d97706'}}>
              👁️
            </div>
          </div>
          <div className="metric-value">{mockAnalytics.conversion.views}</div>
          <div className="metric-change positive">
            <span>↗</span>
            <span>+156 this period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3 className="metric-title">Start Rate</h3>
            <div className="metric-icon" style={{background: '#f3e8ff', color: '#9333ea'}}>
              🚀
            </div>
          </div>
          <div className="metric-value">{mockAnalytics.conversion.startRate}%</div>
          <div className="metric-change negative">
            <span>↘</span>
            <span>-1.2% vs last period</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">Submissions Over Time</h3>
          <div className="submissions-chart">
            {mockAnalytics.trends.daily.map((day, index) => (
              <div
                key={index}
                className="chart-bar"
                style={{
                  height: `${(day.submissions / 15) * 100}%`,
                  backgroundColor: `hsl(220, 70%, ${50 + (day.submissions / 15) * 20}%)`
                }}
                title={`${day.date}: ${day.submissions} submissions`}
              />
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Device Breakdown</h3>
          <div className="device-stats">
            <div className="device-item">
              <div className="device-info">
                <div className="device-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>
                  💻
                </div>
                <span className="device-name">Desktop</span>
              </div>
              <span className="device-percentage">{mockAnalytics.devices.desktop}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${mockAnalytics.devices.desktop}%`}} />
            </div>

            <div className="device-item">
              <div className="device-info">
                <div className="device-icon" style={{background: '#f0fdf4', color: '#059669'}}>
                  📱
                </div>
                <span className="device-name">Mobile</span>
              </div>
              <span className="device-percentage">{mockAnalytics.devices.mobile}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${mockAnalytics.devices.mobile}%`}} />
            </div>

            <div className="device-item">
              <div className="device-info">
                <div className="device-icon" style={{background: '#fef3c7', color: '#d97706'}}>
                  📱
                </div>
                <span className="device-name">Tablet</span>
              </div>
              <span className="device-percentage">{mockAnalytics.devices.tablet}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${mockAnalytics.devices.tablet}%`}} />
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3 className="chart-title">Conversion Funnel</h3>
          <div className="conversion-funnel">
            <div className="funnel-step">
              <span className="funnel-label">Form Views</span>
              <div className="funnel-value">
                <span>{mockAnalytics.conversion.views}</span>
                <span className="funnel-rate">100%</span>
              </div>
            </div>
            <div className="funnel-step">
              <span className="funnel-label">Form Starts</span>
              <div className="funnel-value">
                <span>{mockAnalytics.conversion.starts}</span>
                <span className="funnel-rate">{mockAnalytics.conversion.startRate}%</span>
              </div>
            </div>
            <div className="funnel-step">
              <span className="funnel-label">Completions</span>
              <div className="funnel-value">
                <span>{mockAnalytics.conversion.completions}</span>
                <span className="funnel-rate">{mockAnalytics.conversion.completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="popular-forms">
          <h3 className="chart-title">Most Popular Forms</h3>
          <div className="forms-list">
            {mockAnalytics.overview.popularForms.map((form, index) => (
              <div key={form.id} className="form-item">
                <span className="form-name">{form.name}</span>
                <div className="form-submissions">
                  <span className="submissions-badge">{form.submissions}</span>
                  <span>submissions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
