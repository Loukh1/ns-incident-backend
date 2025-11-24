package com.ns.ochestrator;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentStatsDTO {
    private Long total;
    private Long open;
    private Long closed;

    // New severity fields matching your actual severities
    private Long disaster;
    private Long high;
    private Long average;
    private Long warning;
    private Long information;

    // Optional - for backward compatibility
    private Long critical;
    private Long medium;
    private Long low;

    private List<SeverityCount> bySeverity;
    private List<DayCount> byDay;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeverityCount {
        private String severity;
        private Long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayCount {
        private String date;
        private Long count;
    }
}