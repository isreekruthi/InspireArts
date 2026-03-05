# REWORKING
# InspireArts – Secure Full-Stack Web Application
**An Educational Website for Children's Art and Music Lessons**

InspireArts is a full-stack web application originally built as a static portfolio site and later redesigned with a secure backend architecture. The project demonstrates modern web development practices with an emphasis on secure application design, API integration, and backend security controls.

The platform showcases artwork and music while serving as a practical implementation of secure web development principles relevant to cybersecurity roles.

This project highlights the transition from a basic static website to a secure, maintainable full-stack application using Node.js and Express.

**Live Project - To be updated:**  
https://webpages.charlotte.edu/sinugan1/InspireArts/ThirdUpdate/index.html

---

## Key Features

- Responsive front-end interface for showcasing artwork and music

- Node.js / Express backend architecture

- Secure HTTP headers using Helmet

- Rate limiting to mitigate automated abuse

- Environment variable management using dotenv

- Static asset serving through an Express backend

- Structured project architecture separating frontend and server components

- Integration with external music data APIs

---

## Security Implementations

This project incorporates several security practices commonly used in production web applications:

- Helmet middleware for secure HTTP headers
- Rate limiting to reduce brute-force and abuse attempts
- CORS configuration to control cross-origin requests
- Environment variable protection using .env files
- Backend API routing to reduce exposure of external services
- Input validation groundwork for future secure endpoints

These features demonstrate awareness of OWASP-aligned security principles in web development.

---

## Tech Stack

- **Frontend** – HTML, CSS, JavaScript  
- **Backend** – Node.js, Express.js 
- **Security & Middleware** – Helmet, express-rate-limit, CORS, dotenv, Morgan logging

---

## Project Structure

InspireArts 
│ 
├── public/           # Frontend assets 
│     ├── index.html 
│     ├── styles.css 
│     ├── script.js 
│     └── images/ 
│ 
├── server/           # Backend application 
│     ├── server.js 
│     ├── package.json 
│     ├── package-lock.json 
│     └── node_modules/ 
│ 
├── .gitignore 
└── README.md
---
## Future Improvements

Planned enhancements for continued development include:

- JWT-based authentication system
- Secure admin dashboard
- File upload handling with validation
- Request logging and monitoring
- Stronger input validation and sanitization
- Content Security Policy implementation
- Containerization with Docker
- CI/CD deployment pipeline

---