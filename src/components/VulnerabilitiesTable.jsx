import React from 'react';

export default function VulnerabilitiesTable() {
  return (
    <section className="card vulnerabilities">
      <div className="card-header">
        <h2>Top Vulnerabilities Found</h2>
        <a>View All</a>
      </div>

      <table>
        <thead>
          <tr>
            <th>Vulnerability</th>
            <th>Severity</th>
            <th>Location</th>
            <th>Suggestion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SQL Injection</td>
            <td><span className="severity critical-text">Critical</span></td>
            <td>/search?id=1</td>
            <td>Use parameterized queries</td>
          </tr>
          <tr>
            <td>Cross-Site Scripting (XSS)</td>
            <td><span className="severity high-text">High</span></td>
            <td>/comment.php</td>
            <td>Validate and sanitize input</td>
          </tr>
          <tr>
            <td>Missing Security Headers</td>
            <td><span className="severity medium-text">Medium</span></td>
            <td>/</td>
            <td>Add recommended security headers</td>
          </tr>
          <tr>
            <td>Directory Listing</td>
            <td><span className="severity low-text">Low</span></td>
            <td>/uploads/</td>
            <td>Disable directory listing</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}