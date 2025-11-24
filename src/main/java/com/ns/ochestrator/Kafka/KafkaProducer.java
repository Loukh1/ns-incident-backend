package com.ns.ochestrator.Kafka;

import com.ns.ochestrator.Incident;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, Incident> kafkaTemplate;

    public void sendIncident(Incident incident) {

        Message<Incident> message = MessageBuilder
                .withPayload(incident)
                .setHeader(KafkaHeaders.TOPIC, "incident-topic")
                .build();

        kafkaTemplate.send(message);
    }
}
