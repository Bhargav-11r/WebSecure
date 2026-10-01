# WebSecure

**WebSecure — Security Analysis and Suggestions for Web Applications**

WebSecure is a web-based security analysis platform that performs automated security scans against authorized targets and organizes the resulting technical observations into findings, remediation guidance, and security recommendations.

The project combines a React-based frontend with a FastAPI backend and security scanning tools such as **Nmap** and **Nikto**.

> **Note:** WebSecure is intended for authorized security testing and controlled lab environments. Only scan systems, applications, and networks that you own or have explicit permission to test.

---

## Features

### Security Scanning

* Launch security scans against a specified target
* Nmap-based network and service discovery
* Nikto-based web server security checks
* Background scan processing through the FastAPI backend
* Storage of scan status and results

### Scan Results

* View discovered open ports
* Identify detected network services
* Record service/product/version information when available
* Preserve raw scanner output as technical evidence
* View previous scans through Scan History

### Findings

WebSecure analyzes scanner results and organizes relevant observations into findings.

Findings can include:

* Exposed network services
* Web security observations
* Scanner-reported configuration issues
* Vulnerability information when a matching vulnerability can be identified

Where applicable, WebSecure associates findings with CVE information obtained through the **NVD API**.

### Security Recommendations

The Suggestions section organizes recommendations by security area, allowing users to navigate through:

```text
Suggestions
│
├── Security Area
│   ├── Recommendation
│   └── Recommendation Details
```

Recommendations explain:

* Why the recommendation was generated
* What security area it relates to
* What action can be considered

### Mitigations

The Mitigations section provides remediation guidance based on identified findings and observations.

### Authentication

WebSecure includes user authentication and session management so scan data can be associated with individual users.

---

## Architecture

The current development architecture is:

```text
┌──────────────────────────────┐
│        React + Vite          │
│          Frontend            │
│                              │
│ Dashboard / Scan / Findings  │
│ History / Mitigations        │
│ Suggestions / Settings       │
└──────────────┬───────────────┘
               │
               │ HTTP API
               ▼
┌──────────────────────────────┐
│          FastAPI             │
│           Backend            │
│                              │
│ Authentication               │
│ Scan Management              │
│ Scan Processing              │
│ Finding Analysis             │
│ Vulnerability Analysis       │
└──────────────┬───────────────┘
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
    Nmap     Nikto     NVD
                      API
               │
               ▼
          SQLite Database
```

During development, the React frontend runs on Windows while the FastAPI backend and security scanning environment run inside Kali Linux.

---

## Technology Stack

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS

### Backend

* Python
* FastAPI
* Uvicorn

### Security Tools

* Nmap
* Nikto

### Vulnerability Intelligence

* NVD API
* CVE identification
* CPE-based software mapping

### Database

* SQLite

### Development Environment

* Windows
* Kali Linux
* VirtualBox

### Version Control

* Git
* GitHub

---

## Project Structure

```text
WebSecure/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx
│   │   ├── DashboardGrid.jsx
│   │   ├── Header.jsx
│   │   ├── ScanBox.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SpotlightCard.jsx
│   │   ├── Stats.jsx
│   │   └── VulnerabilitiesTable.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Findings.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Mitigations.jsx
│   │   ├── Scan.jsx
│   │   ├── ScanHistory.jsx
│   │   ├── Settings.jsx
│   │   └── Suggestions.jsx
│   │
│   └── App.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── .gitignore
└── README.md
```

The FastAPI backend is maintained separately from the React frontend.

---

## Scan Processing Flow

A typical scan follows this workflow:

```text
User
 │
 ▼
WebSecure Frontend
 │
 ▼
FastAPI Scan API
 │
 ▼
Background Scan Processor
 │
 ├── Nmap
 │
 └── Nikto
 │
 ▼
Parser
 │
 ├── Structured scan results
 │
 ├── Raw evidence
 │
 └── Scanner findings
 │
 ▼
Analysis
 │
 ├── Service observations
 │
 ├── CPE mapping
 │
 └── CVE analysis
 │
 ▼
Database
 │
 ├── Scan results
 ├── Evidence
 ├── Findings
 └── Suggestions
 │
 ▼
WebSecure Frontend
```

---

## Vulnerability Analysis

When a detected service provides sufficient identification information, WebSecure attempts to map the software to a **CPE (Common Platform Enumeration)** identifier.

The CPE mapping can then be used to query the **National Vulnerability Database (NVD)** for relevant CVE information.

The project is designed to avoid presenting a CVE simply because a service name matches. Applicability and available version information are considered before associating vulnerability information with a finding.

---

## Current Development Environment

The project is currently developed using:

```text
Windows
 └── React + Vite frontend
       │
       │ VirtualBox port forwarding
       ▼
Kali Linux
 └── FastAPI backend
       │
       ├── Nmap
       └── Nikto
```

The frontend communicates with the backend through the FastAPI REST API.

---

## Getting Started

### Frontend

Clone the repository:

```bash
git clone https://github.com/Bhargav-11r/WebSecure.git
cd WebSecure
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL in the terminal.

### Backend

The FastAPI backend is maintained separately from this frontend repository.

The backend requires a Python environment with the required dependencies and access to the security scanning tools used by WebSecure.

---

## Security and Responsible Use

WebSecure is a security testing tool and should only be used against systems for which you have authorization.

Do not use the scanning functionality against:

* Systems you do not own
* Networks without authorization
* Third-party applications without permission
* Production systems where scanning has not been approved

Use controlled environments such as intentionally vulnerable virtual machines or authorized testing environments when learning security testing.

---

## Project Status

WebSecure is an **actively developed cybersecurity project**.

Current functionality includes:

* React-based security dashboard
* User authentication
* Scan management
* Nmap integration
* Nikto integration
* Scan history
* Raw scan evidence
* Structured scan results
* Finding generation
* CPE mapping
* NVD/CVE analysis
* Mitigation guidance
* Security suggestions
* Category-based suggestion navigation

Additional functionality and deployment improvements are planned as development continues.

---

## Future Development

Potential future improvements include:

* Production backend deployment
* Secure environment-variable configuration
* Persistent production database
* Improved scan validation and target handling
* Expanded vulnerability correlation
* More detailed reporting
* Exportable security reports
* Improved authentication and account management
* Additional security scanning capabilities
* Production deployment of the complete platform

---

## Author

**Bhargav Raut**

GitHub: [Bhargav-11r](https://github.com/Bhargav-11r)

---

## License

This project is currently intended as an educational and portfolio cybersecurity project.
