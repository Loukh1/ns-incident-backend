package com.ns.ochestrator;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@Table(name = "Incidents")
public class Incident {
    @Id
    private String incidentId;
    private String source;
    @Column(columnDefinition = "TEXT")
    private String subject;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String severity;
    private String status;
    private LocalDateTime timestamp;
    private LocalDateTime updatedAt;
    @Column(columnDefinition = "TEXT")
    private String aiResponse;
    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fix> fixes = new ArrayList<>();

}
