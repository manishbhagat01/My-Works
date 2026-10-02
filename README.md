# FitSync — Full-Stack Starter

This project implements the MVP described in the FitSync specification:
- Registration/login
- User profile and goals
- Adaptive workout generator
- Activity logging
- Explainable Fitness Score
- Weekly dashboard + Chart.js
- Basic AI Coach interface
- Adaptive recommendation logic
- MySQL persistence
- Java/Spring Boot backend
- HTML/CSS/JavaScript frontend

## Requirements
- Java 17+
- Maven 3.9+
- MySQL 8+

## 1. Create database
MySQL can create it automatically from the JDBC URL, but you can also run:

```sql
CREATE DATABASE fitsync;
```

## 2. Configure database
Default values:
- database: fitsync
- username: root
- password: root

Or set environment variables:

```text
DB_URL=jdbc:mysql://localhost:3306/fitsync
DB_USERNAME=root
DB_PASSWORD=your_password
```

## 3. Run

```bash
mvn spring-boot:run
```

Open:
http://localhost:8080/register.html

## API
POST /api/auth/register
POST /api/auth/login
GET  /api/dashboard/{userId}
GET  /api/users/{userId}
PUT  /api/users/{userId}/profile
GET  /api/activities/{userId}
POST /api/activities/{userId}
GET  /api/workout/{userId}

## Important production upgrades
This is an MVP/starter, not a production medical/fitness service. Before deployment add:
- JWT/session authentication instead of ID-based API access
- Role-based authorization
- HTTPS
- Rate limiting
- Email verification and password reset
- Server-side DTO validation
- Audit logging
- Stronger privacy/consent controls
- CSRF strategy appropriate to the chosen auth model
- AI provider integration with server-side API keys
- MediaPipe pose-estimation module
- Challenges, badges, streak engine and organization/college dashboards
- Automated tests and database migrations
- Production secrets management
