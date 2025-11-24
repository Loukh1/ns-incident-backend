package com.ns.ochestrator;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IncidentService {
    private final WebClient webClient;
    private final IncidentRepository repo;



    public IncidentService(IncidentRepository repo, WebClient.Builder builder) {
        this.repo = repo;
        this.webClient = builder.baseUrl("http://192.168.121.176:8000").build();
    }

    public Incident createIncident(Incident incident) {
        if (incident.getIncidentId() == null || incident.getIncidentId().isBlank()) {
            incident.setIncidentId(UUID.randomUUID().toString());
        }
        incident.setTimestamp(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());

        String content = "Source: " + incident.getSource() +
                "\nSubject: " + incident.getSubject() +
                "\nDescription: " + incident.getDescription();

        Map<String, Object> request = Map.of(
                "model", "ns-llama3.1-8b",
                "messages", List.of(
                        Map.of("role", "user", "content", content)
                ),
                "stream", false
        );

        String aiResponse = null;

        try {
            Map response = webClient.post()
                    .uri("/v1/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(status -> !status.is2xxSuccessful(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("FastAPI error: " + body)))
                    .bodyToMono(Map.class)
                    .block();

            // Extract assistant reply safely
            if (response != null && response.get("choices") instanceof List choices && !choices.isEmpty()) {
                Map firstChoice = (Map) choices.get(0);
                Map message = (Map) firstChoice.get("message");
                aiResponse = message.get("content").toString();
            }

        } catch (Exception e) {
            // Log the error instead of crashing
            System.err.println("AI request failed: " + e.getMessage());
            e.printStackTrace();
            aiResponse = "AI response failed: " + e.getMessage();
        }

        incident.setAiResponse(aiResponse);

        return repo.save(incident);
    }

    /*public Incident createIncident(Incident incident) {
        // Generate an ID if none is provided
        if (incident.getIncidentId() == null || incident.getIncidentId().isBlank()) {
            incident.setIncidentId(UUID.randomUUID().toString());
        }
        String aiResponse = askAi(incident);
        incident.setAiResponse(aiResponse);
        return repo.save(incident);
    }*/
    public List<Incident> getAllIncidents() {
        return repo.findAll();
    }
    public void deleteAll() {
        repo.deleteAll();
    }

    // Optional: count incidents
    public long count() {
        return repo.count();
    }

    @Transactional
    public Incident updateIncident(String incidentId, Incident incidentDetails) {
        Incident existing = repo.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));

        // Update fields
        existing.setSource(incidentDetails.getSource());
        existing.setSubject(incidentDetails.getSubject());
        existing.setDescription(incidentDetails.getDescription());
        existing.setSeverity(incidentDetails.getSeverity());
        existing.setStatus(incidentDetails.getStatus());
        existing.setUpdatedAt(incidentDetails.getUpdatedAt());
        existing.setAiResponse(incidentDetails.getAiResponse());

        // Handle fixes: replace existing fixes with new list
        existing.getFixes().clear();
        if (incidentDetails.getFixes() != null) {
            for (Fix f : incidentDetails.getFixes()) {
                f.setIncident(existing); // Important: set the relationship
                existing.getFixes().add(f);
            }
        }

        return repo.save(existing);
    }
    public Incident getIncident(String incidentId) {
        return repo.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + incidentId));
    }

    public Incident updateStatus(String id, String newStatus) {
        Incident incident = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        incident.setStatus(newStatus);
        incident.setUpdatedAt(LocalDateTime.now());
        return repo.save(incident);
    }

}
