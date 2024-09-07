import React, { useState, useEffect } from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import './App.css';

function App() {
  const [profile, setProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [pageMetrics, setPageMetrics] = useState(null);
  const [startDate, setStartDate] = useState('2024-01-01'); // Example start date
  const [endDate, setEndDate] = useState('2024-12-31');   // Example end date

  const handleLogout = () => {
    setProfile(null);
    setPages([]);
    setSelectedPage('');
    setPageMetrics(null);
    console.log("User logged out");
  };

  useEffect(() => {
    if (profile) {
      const fetchPages = async () => {
        try {
          const response = await fetch(
            `https://graph.facebook.com/me/accounts?access_token=${profile.accessToken}`
          );
          const data = await response.json();
          console.log(data);
          if (data.data) {
            setPages(data.data); // Set the pages in the state
          }
        } catch (error) {
          console.error('Error fetching pages:', error);
        }
      };

      fetchPages();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedPage && profile) {
      const fetchPageMetrics = async () => {
        try {
          const response = await fetch(
            `https://graph.facebook.com/${selectedPage}/insights?metric=page_impressions,page_reactions,post_engaged_users,page_fans&since=${startDate}&until=${endDate}&period=total_over_range&access_token=${profile.accessToken}`
          );
          const data = await response.json();
          console.log(data);
          setPageMetrics(data);
        } catch (error) {
          console.error('Error fetching page metrics:', error);
        }
      };

      fetchPageMetrics();
    }
  }, [selectedPage, profile, startDate, endDate]);

  return (
    <div className="App">
      {!profile ? (
        <LoginSocialFacebook
          appId="3672212903093296"
          onResolve={(response) => {
            console.log(response);
            if (response.data && response.data.accessToken) {
              setProfile(response.data);  // Setting the profile after login
            }
          }}
          onReject={(error) => {
            console.log('Login Error: ', error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        <div>
          <h1>{profile.name}</h1>
          <img src={profile.picture.data.url} alt="Profile" />

          <button onClick={handleLogout}>Logout</button>

          {pages.length > 0 ? (
            <div>
              <h2>Select a Page</h2>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
              >
                <option value="">-- Select a page --</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>No pages owned by the user.</p>
          )}

          {selectedPage && pageMetrics && (
            <div>
              <h2>Page Metrics</h2>
              <div className="metrics-container">
                <div className="metric-card">
                  <h3>Total Followers/Fans</h3>
                  <p>{pageMetrics.data?.find(metric => metric.name === 'page_fans')?.values[0].value || 'N/A'}</p>
                </div>
                <div className="metric-card">
                  <h3>Total Engagement</h3>
                  <p>{pageMetrics.data?.find(metric => metric.name === 'post_engaged_users')?.values[0].value || 'N/A'}</p>
                </div>
                <div className="metric-card">
                  <h3>Total Impressions</h3>
                  <p>{pageMetrics.data?.find(metric => metric.name === 'page_impressions')?.values[0].value || 'N/A'}</p>
                </div>
                <div className="metric-card">
                  <h3>Total Reactions</h3>
                  <p>{pageMetrics.data?.find(metric => metric.name === 'page_reactions')?.values[0].value || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2>Set Date Range</h2>
            <label>
              Start Date:
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </label>
            <label>
              End Date:
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
