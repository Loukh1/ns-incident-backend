package com.ns.notifications;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import static java.nio.charset.StandardCharsets.UTF_8;

import java.util.HashMap;
import java.util.Map;

import static com.ns.notifications.EmailTemplates.INCIDENT_TEMPLATE;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    private static final String destinationEmail = "louay.kh@ns.com";

    @Async
    public void sendIncidentEmail(
            String incidentId,
            String source,
            String subject,
            String description,
            String severity,
            String timestamp,
            String aiResponse
    ) throws MessagingException {

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, UTF_8.name());
        messageHelper.setFrom("ns-llama@ns.com");

        final String templateName = INCIDENT_TEMPLATE.getTemplate();

        Map<String, Object> variables = new HashMap<>();
        variables.put("incidentId", incidentId);
        variables.put("source", source);
        variables.put("subject", subject);
        variables.put("description", description);
        variables.put("severity", severity);
        variables.put("timestamp", timestamp);
        variables.put("aiResponse", aiResponse);

        Context context = new Context();
        context.setVariables(variables);
        messageHelper.setSubject(INCIDENT_TEMPLATE.getSubject());

        try {
            String htmlTemplate = templateEngine.process(templateName, context);
            messageHelper.setText(htmlTemplate, true);

            messageHelper.setTo(destinationEmail);
            mailSender.send(mimeMessage);
            log.info(String.format("INFO - Email successfully sent to %s with template %s ", destinationEmail, templateName));
        } catch (MessagingException e) {
            log.warn("WARNING - Cannot send Email to {} ", destinationEmail);
        }

    }
}
