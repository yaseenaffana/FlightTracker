package com.flighttracker.service;

import com.flighttracker.config.OpenSkyConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class FlightDataService {

    private static final Logger logger = LoggerFactory.getLogger(FlightDataService.class);

    private final RestTemplate restTemplate;
    private final OpenSkyConfig openSkyConfig;

    public FlightDataService(RestTemplate restTemplate, OpenSkyConfig openSkyConfig) {
        this.restTemplate = restTemplate;
        this.openSkyConfig = openSkyConfig;
    }

    @Cacheable(value = "flightData", unless = "#result == null")
    @Retryable(value = { RestClientException.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public Map<String, Object> getFlightData() {
        logger.info("Fetching flight data from OpenSky Network API");

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Add Basic Auth only when credentials are provided.
            // (OpenSky supports anonymous access with tighter limits.)
            String clientId = openSkyConfig.getClientId();
            String clientSecret = openSkyConfig.getClientSecret();
            if (clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank()) {
                String auth = clientId + ":" + clientSecret;
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                headers.set("Authorization", "Basic " + encodedAuth);
            } else {
                logger.info("No OpenSky credentials configured; using anonymous request");
            }

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Make the API call
            ResponseEntity<Map> response = restTemplate.exchange(openSkyConfig.getUrl(), HttpMethod.GET, entity,
                    Map.class);

            logger.info("Successfully retrieved flight data");
            return response.getBody();

        } catch (RestClientException e) {
            logger.error("Failed to fetch flight data from OpenSky API: {}", e.getMessage());
            throw e;
        }
    }

    @Recover
    public Map<String, Object> recover(RestClientException e) {
        logger.error("All retry attempts failed for OpenSky API call: {}", e.getMessage());
        // Return empty response or cached data if available
        return Map.of("states", new Object[0]);
    }

    @Cacheable(value = "aircraftFlights", key = "#icao24 + ':' + #begin + ':' + #end", unless = "#result == null")
    @Retryable(value = { RestClientException.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public List<Map<String, Object>> getAircraftFlights(String icao24, long begin, long end) {
        logger.info("Fetching aircraft flights from OpenSky for {} ({} -> {})", icao24, begin, end);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String clientId = openSkyConfig.getClientId();
            String clientSecret = openSkyConfig.getClientSecret();
            if (clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank()) {
                String auth = clientId + ":" + clientSecret;
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                headers.set("Authorization", "Basic " + encodedAuth);
            } else {
                logger.info("No OpenSky credentials configured; using anonymous request");
            }

            String url = UriComponentsBuilder
                    .fromUriString(openSkyConfig.getUrl())
                    .replacePath("/api/flights/aircraft")
                    .replaceQuery(null)
                    .queryParam("icao24", icao24)
                    .queryParam("begin", begin)
                    .queryParam("end", end)
                    .toUriString();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

            // Response is a JSON array of objects. Spring deserializes this as
            // List<LinkedHashMap<...>>
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> body = (List<Map<String, Object>>) response.getBody();

            return body == null ? List.of() : body;
        } catch (RestClientException e) {
            logger.error("Failed to fetch aircraft flights from OpenSky API: {}", e.getMessage());
            throw e;
        }
    }

    @Cacheable(value = "aircraftMetadata", key = "#icao24", unless = "#result == null")
    @Retryable(value = { RestClientException.class }, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public Map<String, Object> getAircraftMetadata(String icao24) {
        logger.info("Fetching aircraft metadata from OpenSky for {}", icao24);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String clientId = openSkyConfig.getClientId();
            String clientSecret = openSkyConfig.getClientSecret();
            if (clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank()) {
                String auth = clientId + ":" + clientSecret;
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                headers.set("Authorization", "Basic " + encodedAuth);
            } else {
                logger.info("No OpenSky credentials configured; using anonymous request");
            }

            String url = UriComponentsBuilder
                    .fromUriString(openSkyConfig.getUrl())
                    .replacePath("/api/metadata/aircraft/" + icao24)
                    .replaceQuery(null)
                    .toUriString();

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.getBody();

            return body == null ? Map.of() : body;
        } catch (RestClientException e) {
            logger.error("Failed to fetch aircraft metadata from OpenSky API: {}", e.getMessage());
            throw e;
        }
    }
}
