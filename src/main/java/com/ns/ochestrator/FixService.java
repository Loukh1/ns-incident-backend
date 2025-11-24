package com.ns.ochestrator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixService {

    private final FixRepository fixRepository;
    private final IncidentRepository incidentRepository;

    public List<Fix> getFixesByIncidentId(String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));
        return fixRepository.findByIncident(incident);
    }

    public Fix createFix(String incidentId, Fix fix) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));

        fix.setIncident(incident);
        fix.setCreatedAt(LocalDateTime.now());

        if (fix.getStatus() == null) {
            fix.setStatus("IN_PROGRESS");
        }

        return fixRepository.save(fix);
    }

    public Fix updateFixStatus(String fixId, String status) {
        Fix fix = fixRepository.findById(fixId)
                .orElseThrow(() -> new RuntimeException("Fix not found with id: " + fixId));

        fix.setStatus(status);
        return fixRepository.save(fix);
    }

    public void deleteFix(String fixId) {
        fixRepository.deleteById(fixId);
    }
}