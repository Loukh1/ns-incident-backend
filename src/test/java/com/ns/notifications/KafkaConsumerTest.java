package com.ns.notifications;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KafkaConsumerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private KafkaConsumer kafkaConsumer;

    @Test
    void consumeIncident_CallsEmailService() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("incidentId", "INC-1");
        data.put("source", "Server");
        data.put("subject", "Test");
        data.put("description", "Desc");
        data.put("severity", "HIGH");
        data.put("timestamp", Arrays.asList(2025, 1, 15, 14, 30, 0));
        data.put("aiResponse", "AI Response");

        kafkaConsumer.consumeIncident(data);

        verify(emailService).sendIncidentEmail(anyString(), anyString(), anyString(),
                anyString(), anyString(), anyString(), anyString());
    }
}