# DRDL Fire Management System

A comprehensive Spring Boot + React application for managing safety fire requests across DRDL (Defence Research and Development Laboratory).

## Project Structure

```
drdl-mini/
├── backend/              # Spring Boot REST API
│   ├── src/main/java
│   ├── src/test/java
│   └── pom.xml
├── frontend/             # React UI
│   ├── src/components
│   ├── src/services
│   ├── src/styles
│   └── package.json
├── documentation/        # Project documentation
└── README.md
```

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.1.5
- Spring Data JPA
- Hibernate
- H2 Database (development) / Oracle Database (production)
- Maven

**Frontend:**
- React 18.2
- CSS3 (responsive design)
- Jest & React Testing Library

## Prerequisites

- **Java:** JDK 17 or higher
- **Node.js:** v14 or higher with npm
- **Maven:** v3.8 or higher
- **Oracle Database:** Optional (if using Oracle profile)

## Quick Start

### 1. Clone & Navigate

```bash
git clone https://github.com/Sriyasrisistu/min_drdl.git
cd drdl-mini
```

### 2. Backend Setup & Run

```bash
cd backend

# Install dependencies (Maven)
mvn clean install

# Run with H2 (default - development)
mvn spring-boot:run

# OR Run with Oracle (production - requires Oracle connection)
# Set environment variables first:
# Windows PowerShell:
$env:ORACLE_URL='jdbc:oracle:thin:@//HOST:PORT/SERVICE'
$env:ORACLE_USER='system'
$env:ORACLE_PASSWORD='mini1912'

# Then run with oracle profile:
mvn -Dspring-boot.run.profiles=oracle spring-boot:run
```

**Backend runs at:** http://localhost:8080  
**H2 Console (dev):** http://localhost:8080/h2-console (username: `sa`, password: empty)

### 3. Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs at:** http://localhost:3000

### 4. Test the Integration

Open http://localhost:3000 in your browser and:

1. Select a **Type of Safety Coverage** (e.g., "INTEGRATION")
2. Enter a **Personnel Number** (e.g., "123456")
3. Fill in the coverage-specific fields
4. Check the safety declaration
5. Click **SEND TO HEAD, SFEED**

Expected API call: `POST http://localhost:8080/api/v1/safety-requests`

Verify in browser DevTools → Network tab.

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
mvn test

# Run with coverage
mvn jacoco:report

# View HTML coverage report
# Open target/site/jacoco/index.html in browser
```

### Frontend Tests

```bash
cd frontend

# Run tests in watch mode (press 'a' to run all)
npm test

# Run tests once with coverage
npm run test:coverage

# View coverage report
# Open coverage/lcov-report/index.html in browser
```

## API Endpoints

### Safety Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/safety-requests` | Create new request |
| GET | `/api/v1/safety-requests` | Get all requests |
| GET | `/api/v1/safety-requests/{id}` | Get request by ID |
| PUT | `/api/v1/safety-requests/{id}` | Update request |
| DELETE | `/api/v1/safety-requests/{id}` | Delete request |
| GET | `/api/v1/safety-requests/coverage/{coverage}` | Get by coverage type |

### Request Body Example

```json
{
  "personnelNumber": "123456",
  "safetyCoverage": "integration",
  "directorate": "DRDL",
  "division": "Engineering",
  "integrationFacility": "NGRAM",
  "articleDetails": "Details of equipment",
  "workDescription": "Description of work",
  "activitySchedule": "available",
  "ambulanceRequired": "required",
  "testBed": "HTF",
  "workCentre": "TSTC"
}
```

## Configuration

### Database Profiles

#### H2 (Development - Default)
**File:** `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:h2:mem:drdl;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

#### Oracle (Production)
**File:** `backend/src/main/resources/application-oracle.properties`

Set environment variables:
```bash
ORACLE_URL=jdbc:oracle:thin:@//hostname:1521/SERVICENAME
ORACLE_USER=system
ORACLE_PASSWORD=mini1912
```

Then activate profile:
```bash
mvn -Dspring-boot.run.profiles=oracle spring-boot:run
```

## Frontend Coverage Types

1. **INTEGRATION** - Integration facility testing (NGRAM, QRSAM, ASTRA, etc.)
2. **STATIC TEST** - Static testing on various test beds
3. **THERMOSTRUCTURAL** - Thermal testing (TSTC)
4. **PRESSURE TEST** - Pressure testing (ASTC, SSTC)
5. **GRT** - Gas Recirculation Testing
6. **ALIGNMENT INSPECTION** - Alignment checks (AIC-I, AIC-II)
7. **RADIOGRAPHY** - Radiographic inspection (LARC, NDED)
8. **HYDROBASIN** - Hydrobasin testing
9. **TRANSPORTATION** - Equipment transportation safety
10. **OTHER** - Custom safety coverage type

## Error Handling

- API errors are caught and displayed as red error messages on the form
- Frontend validation prevents submission without required fields
- Backend logs are available in console during development

## Common Issues & Solutions

### Port 8080 Already in Use
```bash
# Kill process on port 8080 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process

# Or use a different port:
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"
```

### Port 3000 Already in Use
```bash
# React will prompt to use a different port, or set manually:
PORT=3001 npm start
```

### CORS Errors
Frontend and backend CORS is configured in:
- **Backend:** `SafetyRequestController.java` (@CrossOrigin annotation)
- **Frontend API URL:** `frontend/src/services/apiService.js`

Ensure both are pointing to the correct URLs.

### Oracle Connection Fails
1. Verify Oracle credentials are correct
2. Check firewall/network access to Oracle host
3. Verify ORACLE_URL format: `jdbc:oracle:thin:@//hostname:port/servicename`
4. Ensure `ojdbc11` library is in classpath (Maven dependency)

## Build & Deploy

### Build Backend JAR
```bash
cd backend
mvn clean package
# Output: target/fire-management-system-1.0.0.jar
```

### Build Frontend Dist
```bash
cd frontend
npm run build
# Output: build/ directory (ready for static hosting)
```

## Docker Support (Optional)

Create a `Dockerfile` in the backend root:
```dockerfile
FROM openjdk:17-slim
COPY target/fire-management-system-1.0.0.jar /app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080
```

Build and run:
```bash
docker build -t drdl-backend:latest .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=oracle drdl-backend:latest
```

## Documentation

- [API Documentation](./documentation/API_DOCUMENTATION.md)
- [Setup Guide](./documentation/SETUP_GUIDE.md)

## Git Workflow

```bash
# Stage changes
git add -A

# Commit
git commit -m "Add feature or fix: describe changes"

# Push to main branch
git push origin main
```

## Contact & Support

For issues or questions, create an issue in the GitHub repository:  
https://github.com/Sriyasrisistu/min_drdl/issues

## License

Proprietary - DRDL


**Frontend:**
```bash
cd frontend
npm install
npm start
```

Backend runs on: `http://localhost:8080`
Frontend runs on: `http://localhost:3000`

---

##  Features

### Safety Coverage Types
- **INTEGRATION** - Integration facility tests
- **STATIC TEST** - Static test bed evaluations
- **THERMOSTRUCTURAL** - Thermal and structural analysis
- **PRESSURE TEST** - Pressure testing operations
- **GRT** - General Research Tests
- **ALIGNMENT INSPECTION** - Alignment verification
- **RADIOGRAPHY** - Radiographic testing
- **HYDROBASIN** - Water basin operations
- **TRANSPORTATION** - Material transportation
- **ANY OTHER** - Custom safety coverage

### Key Functionalities
 Create and manage safety requests
 TARB clearance tracking
 Activity scheduling and monitoring
 Ambulance requirement management
 Test controller assignment
 Approval workflow (Head SFEED → GD-TS)
 Transportation management
 Driver authorization tracking
 Request history and reporting

---

##  Architecture

### Tech Stack

**Backend:**
- Spring Boot 3.1.5
- Spring Data JPA
- Oracle JDBC Driver
- Lombok (Data annotation library)
- Maven

**Frontend:**
- React 18.2.0
- Vanilla JavaScript (ES6+)
- CSS3 with responsive design
- Fetch API for HTTP requests

**Database:**
- Oracle 11g/12c
- 33 columns for comprehensive data capture

---

##  Project Structure

```
drdl-fire-management/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/drdl/
│   │   ├── DrdlApplication.java
│   │   ├── controller/
│   │   │   └── SafetyRequestController.java
│   │   ├── service/
│   │   │   └── SafetyRequestService.java
│   │   ├── repository/
│   │   │   └── SafetyRequestRepository.java
│   │   ├── model/
│   │   │   └── SafetyRequest.java
│   │   ├── dto/
│   │   │   └── SafetyRequestDTO.java
│   │   └── config/
│   │       └── CorsConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                         # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SafetyFireRequestForm.jsx
│   │   │   ├── IntegrationSection.jsx
│   │   │   ├── StaticTestSection.jsx
│   │   │   └── TransportationSection.jsx
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── styles/
│   │   │   └── SafetyFireRequestForm.css
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── documentation/
    ├── API_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    └── README.md (this file)
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/safety-requests` | Create new request |
| GET | `/safety-requests` | Get all requests |
| GET | `/safety-requests/{id}` | Get single request |
| PUT | `/safety-requests/{id}` | Update request |
| GET | `/safety-requests/coverage/{coverage}` | Filter by coverage type |
| DELETE | `/safety-requests/{id}` | Delete request |

---

##  Database Schema

The `SAFETY_REQUEST` table contains 33 columns capturing:
- Personnel and organizational details
- Safety coverage type and specifics
- Activity scheduling and dates
- Test bed/center information
- TARB clearance status
- Ambulance requirements
- Approval workflow status
- Transportation and driver details

See `documentation/SETUP_GUIDE.md` for full schema.

---

##  CORS Configuration

**Allowed Origins:** `http://localhost:3000`
**Methods:** GET, POST, PUT, DELETE, OPTIONS
**Max Age:** 3600 seconds

---

##  Documentation

- **Setup Guide:** `documentation/SETUP_GUIDE.md`
- **API Documentation:** `documentation/API_DOCUMENTATION.md`
- **Database Schema:** See SETUP_GUIDE.md

---

##  Development Workflow

1. **Backend Development**
   - Create Spring Boot application
   - Define entities and DTOs
   - Implement business logic in services
   - Create REST endpoints
   - Configure CORS

2. **Frontend Development**
   - Create React components
   - Integrate with API service
   - Add form validation
   - Style with CSS
   - Test with backend

3. **Integration**
   - Ensure both services run simultaneously
   - Test API endpoints from frontend
   - Verify CORS configuration
   - Handle errors gracefully

---

##  Configuration

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:ORCL
spring.datasource.username=DRDL_USER
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.Oracle10gDialect
server.port=8080
```

### Frontend (apiService.js)
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1/safety-requests';
```

---

##  Testing

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

---

##  Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
# Creates: target/fire-management-system-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Creates: build/ folder with optimized files
```

---

##  Troubleshooting

### Database Connection Error
- Verify Oracle is running
- Check credentials in `application.properties`
- Test connection: `sqlplus DRDL_USER/password@ORCL`

### Port Already in Use
- Backend: Change `server.port` in `application.properties`
- Frontend: Set `PORT` environment variable

### CORS Errors
- Ensure backend CORS config matches frontend URL
- Backend must be running before frontend makes requests

### Maven Build Fails
```bash
mvn clean
rm -rf ~/.m2/repository
mvn install
```

---

##  Code Standards

### Backend (Java)
- Follow Spring Framework conventions
- Use DTOs for API contracts
- Implement business logic in services
- Add appropriate annotations (@Entity, @Service, etc.)

### Frontend (React)
- Use functional components with hooks
- Separate concerns into multiple components
- Handle errors with user-friendly messages
- Use CSS classes for styling

---

##  Continuous Integration

Recommended CI/CD tools:
- **GitHub Actions** for automated tests
- **Docker** for containerization
- **Kubernetes** for orchestration

---


##  License

Internal DRDL Project - Confidential

---

##  Team

**Developed by:** DRDL Development Team
**Last Updated:** November 2024
**Version:** 1.0.0

---

##  Future Enhancements

- [ ] User authentication & authorization
- [ ] Email notifications
- [ ] Advanced reporting & analytics
- [ ] Mobile application
- [ ] Document upload & storage
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Dark mode UI

---

##  Contact

**Email:** sistusriyasri@gmail.com

---
