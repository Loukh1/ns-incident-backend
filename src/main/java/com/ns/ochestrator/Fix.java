package com.ns.ochestrator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Fixes")
public class Fix {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String fixId;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String status; // ex: SUCCESS, FAILED, IN_PROGRESS
    private String fixedBy;
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private Incident incident;   // each fix belongs to one incident
}
