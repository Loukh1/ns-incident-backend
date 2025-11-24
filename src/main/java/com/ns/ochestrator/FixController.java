package com.ns.ochestrator;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/incidents/{incidentId}/fixes")
@RequiredArgsConstructor
public class FixController {

    private final FixService fixService;

    // GET /api/v1/incidents/{incidentId}/fixes - Get all fixes for an incident
    @GetMapping
    public ResponseEntity<List<Fix>> getFixesByIncident(@PathVariable String incidentId) {
        List<Fix> fixes = fixService.getFixesByIncidentId(incidentId);
        return ResponseEntity.ok(fixes);
    }

    // POST /api/v1/incidents/{incidentId}/fixes - Create a new fix
    @PostMapping
    public ResponseEntity<Fix> createFix(
            @PathVariable String incidentId,
            @RequestBody Fix fix) {
        Fix created = fixService.createFix(incidentId, fix);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/v1/incidents/{incidentId}/fixes/{fixId}/status - Update fix status
    @PutMapping("/{fixId}/status")
    public ResponseEntity<Fix> updateFixStatus(
            @PathVariable String incidentId,
            @PathVariable String fixId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        Fix updated = fixService.updateFixStatus(fixId, status);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/v1/incidents/{incidentId}/fixes/{fixId} - Delete a fix
    @DeleteMapping("/{fixId}")
    public ResponseEntity<Void> deleteFix(
            @PathVariable String incidentId,
            @PathVariable String fixId) {
        fixService.deleteFix(fixId);
        return ResponseEntity.noContent().build();
    }
}