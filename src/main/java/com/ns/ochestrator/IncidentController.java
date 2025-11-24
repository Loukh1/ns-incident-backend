package com.ns.ochestrator;

import com.ns.ochestrator.Kafka.KafkaProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;
    private final KafkaProducer producer;
    private final IncidentStatsService statsService;
    @PostMapping
    public ResponseEntity<Incident> createIncident(@RequestBody Incident incident) {
        Incident saved = incidentService.createIncident(incident);
        producer.sendIncident(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        List<Incident> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        incidentService.deleteAll();
        return ResponseEntity.noContent().build(); // 204 No Content
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        long count = incidentService.count();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(
            @PathVariable String id,
            @RequestBody Incident incidentDetails) {
        Incident updated = incidentService.updateIncident(id, incidentDetails);
        producer.sendIncident(updated); // optionally send updated incident to Kafka
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncident(@PathVariable String id) {
        Incident incident = incidentService.getIncident(id);
        //producer.sendIncident(updated); // optionally send updated incident to Kafka
        return ResponseEntity.ok(incident);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateIncidentStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate
    ) {
        String newStatus = statusUpdate.get("status");
        Incident updatedIncident = incidentService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updatedIncident);
    }
    @GetMapping("/stats")
    public ResponseEntity<IncidentStatsDTO> getStatistics() {
        IncidentStatsDTO stats = statsService.getStatistics();
        return ResponseEntity.ok(stats);
    }

}
