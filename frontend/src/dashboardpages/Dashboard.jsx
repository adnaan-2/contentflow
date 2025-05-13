// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const sampleData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 500 },
  { name: 'Thu', value: 200 },
  { name: 'Fri', value: 278 },
  { name: 'Sat', value: 189 },
  { name: 'Sun', value: 239 }
];

const Dashboard = () => {
  const [counts, setCounts] = useState({ fb: 0, insta: 0, tw: 0, li: 0 });

  useEffect(() => {
    const targetCounts = { fb: 1245, insta: 893, tw: 563, li: 1102 };
    const interval = setInterval(() => {
      setCounts(prev => {
        const updated = { ...prev };
        let done = true;
        for (let key in updated) {
          if (updated[key] < targetCounts[key]) {
            updated[key] += Math.ceil((targetCounts[key] - updated[key]) / 10);
            done = false;
          }
        }
        if (done) clearInterval(interval);
        return updated;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboardContainer">
     
      {/* Summary cards at the top */}
      <div className="summaryGrid">
        <div className="card fb">
          <FaFacebook className="icon" />
          <span className="card-title">Facebook</span>
          <div className="counter">+{counts.fb}</div>
          <div>Followers</div>
        </div>
        <div className="card insta">
          <FaInstagram className="icon" />
          <span className="card-title">Instagram</span>
          <div className="counter">{counts.insta}</div>
          <div>Followers</div>
        </div>
        <div className="card tw">
          <FaTwitter className="icon" />
          <span className="card-title">Twitter</span>
          <div className="counter">{counts.tw}</div>
          <div>Followers</div>
        </div>
        <div className="card li">
          <FaLinkedin className="icon" />
          <span className="card-title">LinkedIn</span>
          <div className="counter">{counts.li}</div>
          <div>Connections</div>
        </div>
      </div>
      
      {/* Main content area with 2 columns */}
      <div className="dashboardMainContent">
        {/* Charts on the left (75% width) */}
        <div className="chartsContainer">
          <div className="analyticsCard">
            <h3>Facebook Engagement</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b5998" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="analyticsCard">
            <h3>Instagram Engagement</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#e1306c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="analyticsCard">
            <h3>Twitter Analytics</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#1da1f2" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="analyticsCard">
            <h3>LinkedIn Analytics</h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0077b5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Goal cards stacked vertically on the right (25% width) */}
        <div className="goalsContainer">
          <div className="goalCard dashboard">
            Engagement Goal<br/>
            <span>70%</span>
          </div>
          
          <div className="goalCard completed">
            Posts Scheduled<br/>
            <span>34%</span>
          </div>
          
          <div className="goalCard visitors">
            New Followers<br/>
            <span>62%</span>
          </div>
          
          <div className="goalCard subscriptions">
            Shares This Week<br/>
            <span>10%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
