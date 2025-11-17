package com.regionalportal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "regional_issue_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegionalIssueHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regional_issue_id")
    private RegionalIssue regionalIssue;


    @Column(name = "description", length = 1000)
    private String description;


    @Column(name = "details", length = 4000)
    private String details;


    @Column(name = "updated_time")
    private LocalDateTime updatedTime = LocalDateTime.now();


    @Enumerated(EnumType.STRING)
    @Column(name = "issue_status")
    private IssueStatus issueStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officer_id")
    private User updatedByOfficer;
}
