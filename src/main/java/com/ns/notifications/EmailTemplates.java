package com.ns.notifications;

import lombok.Getter;

public enum EmailTemplates {

    INCIDENT_TEMPLATE("incident-template.html", "incident notification");

    @Getter
    private final String template;
    @Getter
    private final String subject;


    EmailTemplates(String template, String subject) {
        this.template = template;
        this.subject = subject;
    }
}
