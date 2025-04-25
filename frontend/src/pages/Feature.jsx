import React from 'react';
import '../styles/Homepage.css';

const FeaturesSection = () => (
  <section id="features" className="features-section">
    <div className="container">
      <h2>Features</h2>
      <p className="section-intro">Everything you need to create, manage, and publish content</p>
      <div className="features-grid">
        {[
          { icon: "📝", title: "Content Editor", desc: "Intuitive drag-and-drop editor with rich formatting options" },
          { icon: "🔄", title: "Workflow Management", desc: "Streamline your content pipeline from draft to publication" },
          { icon: "📊", title: "Analytics", desc: "Track performance with comprehensive analytics dashboards" },
          { icon: "🔍", title: "SEO Tools", desc: "Optimize your content for better search visibility" },
          { icon: "🔔", title: "Notifications", desc: "Stay updated with real-time notifications and alerts" },
          { icon: "📱", title: "Mobile Friendly", desc: "Access your content from any device, anywhere" },
        ].map((feature, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
