package com.flighttracker.controller;

import com.flighttracker.service.FlightDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FlightController {

    private static final Logger logger = LoggerFactory.getLogger(FlightController.class);

    private final FlightDataService flightDataService;

    public FlightController(FlightDataService flightDataService) {
        this.flightDataService = flightDataService;
    }

    @GetMapping("/flights")
    public ResponseEntity<Map<String, Object>> getFlights() {
        logger.info("Received request for flight data");

        try {
            Map<String, Object> flightData = flightDataService.getFlightData();
            return ResponseEntity.ok(flightData);
        } catch (Exception e) {
            logger.error("Error retrieving flight data: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/aircraft/{icao24}/flights")
    public ResponseEntity<List<Map<String, Object>>> getAircraftFlights(
            @PathVariable String icao24,
            @RequestParam(name = "hours", defaultValue = "12") int hours) {
        try {
            long end = Instant.now().getEpochSecond();
            long begin = end - Math.max(1, Math.min(hours, 48)) * 3600L;
            List<Map<String, Object>> flights = flightDataService.getAircraftFlights(icao24, begin, end);
            return ResponseEntity.ok(flights);
        } catch (Exception e) {
            logger.error("Error retrieving aircraft flights: {}", e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/aircraft/{icao24}/metadata")
    public ResponseEntity<Map<String, Object>> getAircraftMetadata(@PathVariable String icao24) {
        try {
            Map<String, Object> metadata = flightDataService.getAircraftMetadata(icao24);
            return ResponseEntity.ok(metadata);
        } catch (Exception e) {
            logger.error("Error retrieving aircraft metadata: {}", e.getMessage());
            return ResponseEntity.ok(Map.of());
        }
    }
}
