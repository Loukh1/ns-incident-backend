package com.ns.ochestrator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentStatsService {

    private final IncidentRepository incidentRepository;

    public IncidentStatsDTO getStatistics() {
        List<Incident> allIncidents = incidentRepository.findAll();

        // Count by status
        long totalCount = allIncidents.size();
        long openCount = allIncidents.stream()
                .filter(i -> "OPEN".equalsIgnoreCase(i.getStatus()) ||
                        "IN_PROGRESS".equalsIgnoreCase(i.getStatus()))
                .count();
        long closedCount = allIncidents.stream()
                .filter(i -> "CLOSED".equalsIgnoreCase(i.getStatus()) ||
                        "RESOLVED".equalsIgnoreCase(i.getStatus()))
                .count();

        // Count by severity - with your actual severity names
        long disasterCount = countBySeverity(allIncidents, "Disaster");
        long highCount = countBySeverity(allIncidents, "High");
        long averageCount = countBySeverity(allIncidents, "Average");
        long warningCount = countBySeverity(allIncidents, "Warning");
        long informationCount = countBySeverity(allIncidents, "Information");

        // Group by severity
        List<IncidentStatsDTO.SeverityCount> bySeverity = allIncidents.stream()
                .collect(Collectors.groupingBy(
                        Incident::getSeverity,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> IncidentStatsDTO.SeverityCount.builder()
                        .severity(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        // Group by day
        List<IncidentStatsDTO.DayCount> byDay = groupByDay(allIncidents);

        return IncidentStatsDTO.builder()
                .total(totalCount)
                .open(openCount)
                .closed(closedCount)

                // New fields with actual severity names
                .disaster(disasterCount)
                .high(highCount)
                .average(averageCount)
                .warning(warningCount)
                .information(informationCount)

                // Optional - for backward compatibility
                .critical(disasterCount)
                .medium(averageCount)
                .low(informationCount)

                .bySeverity(bySeverity)
                .byDay(byDay)
                .build();
    }

    private long countBySeverity(List<Incident> incidents, String severity) {
        return incidents.stream()
                .filter(i -> severity.equalsIgnoreCase(i.getSeverity()))
                .count();
    }

    private List<IncidentStatsDTO.DayCount> groupByDay(List<Incident> incidents) {
        // Check if timestamp is String or LocalDateTime
        // This handles both cases for backward compatibility

        Map<String, Long> dateCountMap = incidents.stream()
                .map(incident -> {
                    try {
                        Object timestamp = incident.getTimestamp();

                        if (timestamp instanceof LocalDateTime) {
                            // If it's LocalDateTime, convert to date string
                            LocalDateTime dateTime = (LocalDateTime) timestamp;
                            return dateTime.toLocalDate().toString(); // "yyyy-MM-dd"
                        } else if (timestamp instanceof String) {
                            // If it's String format "10:48:38 on 2025.11.13"
                            String timestampStr = (String) timestamp;
                            String[] parts = timestampStr.split(" on ");
                            if (parts.length > 1) {
                                String datePart = parts[1]; // "2025.11.13"
                                String[] dateParts = datePart.split("\\.");
                                // Convert to yyyy-MM-dd format
                                return dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2];
                            }
                        }
                        return null;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(
                        date -> date,
                        Collectors.counting()
                ));

        // Sort by date
        return dateCountMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> IncidentStatsDTO.DayCount.builder()
                        .date(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}