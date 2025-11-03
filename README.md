# DRDL Fire Management System

A comprehensive full-stack web application for managing safety fire requests at DRDL (Defence Research and Development Laboratory).

##  Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Oracle Database 11g/12c
- Maven 3.8.1+

### Installation

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

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
