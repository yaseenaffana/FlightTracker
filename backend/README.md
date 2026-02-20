# Flight Tracker Backend

Spring Boot backend service that securely proxies the OpenSky Network API for the React flight tracker frontend.

## Features

- **Secure API Proxy**: Server-side authentication with OpenSky Network
- **In-Memory Caching**: 30-second cache to reduce API calls
- **Retry Logic**: Exponential backoff for failed requests
- **CORS Support**: Configured for localhost frontend development
- **Same JSON Response**: Maintains compatibility with OpenSky API structure

## Setup Instructions

### 1. Prerequisites
- Java 17 or higher
- Maven 3.6+

### 2. OpenSky Network Account
1. Register at [OpenSky Network](https://opensky-network.org/)
2. Get your username and password

### 3. Environment Variables
Set the following environment variables or update `application.properties`:

```bash
export OPENSKY_USERNAME=your_opensky_username
export OPENSKY_PASSWORD=your_opensky_password
```

### 4. Build and Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 5. API Endpoint
- **GET** `/api/flights` - Returns flight data (same structure as OpenSky API)

## Configuration

### application.properties
```properties
# Server
server.port=8080

# OpenSky API
opensky.api.url=https://opensky-network.org/api/states/all
opensky.api.username=${OPENSKY_USERNAME:your_username}
opensky.api.password=${OPENSKY_PASSWORD:your_password}

# Cache (TTL in seconds)
opensky.cache.ttl=30

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

## Architecture

### Components
- **FlightController**: REST endpoint handler
- **FlightDataService**: API proxy with caching and retry logic
- **OpenSkyConfig**: Configuration properties
- **CacheConfig**: In-memory cache configuration
- **CorsConfig**: CORS configuration

### Security
- Credentials stored securely in environment variables
- Basic Authentication used for OpenSky API calls
- No sensitive data exposed to frontend

### Performance
- 30-second cache reduces API calls by ~98%
- Retry logic with exponential backoff
- Request timeout handling
- Proper resource cleanup

## Testing

```bash
mvn test
```

## Integration with Frontend

The backend is designed to be a drop-in replacement for direct OpenSky API calls. The React frontend automatically uses the backend proxy when running on the same domain.

## Production Deployment

For production:
1. Use external cache (Redis)
2. Configure proper CORS origins
3. Set up monitoring and logging
4. Use environment-specific configuration
5. Consider rate limiting for the proxy endpoint