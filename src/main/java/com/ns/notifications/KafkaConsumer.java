package com.ns.notifications;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaConsumer {

    private final EmailService emailService;

    @KafkaListener(topics = "incident-topic", groupId = "notification-group")
    public void consumeIncident(Map<String, Object> incidentData) {
        log.info("📥 Received Incident Data: {}", incidentData);

        String incidentId = (String) incidentData.get("incidentId");
        String source = (String) incidentData.get("source");
        String subject = (String) incidentData.get("subject");
        String description = (String) incidentData.get("description");
        String severity = (String) incidentData.get("severity");
        String aiResponse = (String) incidentData.get("aiResponse");

        // FIX: Convert timestamp array to ISO string
        String timestamp = convertListToIso(incidentData.get("timestamp"));

        try {
            emailService.sendIncidentEmail(
                    incidentId,
                    source,
                    subject,
                    description,
                    severity,
                    timestamp,
                    aiResponse
            );
        } catch (Exception e) {
            log.error("Failed to send incident email", e);
        }
    }

    /**
     * Converts a timestamp array [Y, M, D, H, m, s, nanos] into ISO string "YYYY-MM-DDTHH:mm:ss"
     */
    private String convertListToIso(Object value) {
        if (value instanceof List<?> list && list.size() >= 6) {
            int year = (int) list.get(0);
            int month = (int) list.get(1);
            int day = (int) list.get(2);
            int hour = (int) list.get(3);
            int minute = (int) list.get(4);
            int second = (int) list.get(5);

            return LocalDateTime
                    .of(year, month, day, hour, minute, second)
                    .toString();
        }

        return null;
    }
}
