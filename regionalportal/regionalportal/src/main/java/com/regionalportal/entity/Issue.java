////package com.regionalportal.entity;
////
////import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
////import com.fasterxml.jackson.annotation.JsonInclude;
////import jakarta.persistence.*;
////import lombok.AllArgsConstructor;
////import lombok.Data;
////import lombok.NoArgsConstructor;
////
////import java.time.LocalDateTime;
////
/////**
//// * Issue — represents an issue reported by a citizen.
//// */
////@Entity
////@Table(name = "issues")
////@Data
////@NoArgsConstructor
////@AllArgsConstructor
////@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
////@JsonInclude(JsonInclude.Include.NON_NULL)
////public class Issue {
////
////    @Id
////    @GeneratedValue(strategy = GenerationType.IDENTITY)
////    private Long id;
////
////    private String title;
////
////    @Column(length = 1000)
////    private String description;
////
////    private String category;
////    private String location;
////    private String priority;  // LOW / MEDIUM / HIGH
////    private String status;    // PENDING / IN_PROGRESS / RESOLVED
////
////    @Column(length = 1000)
////    private String officerComment;
////
////    private LocalDateTime createdAt = LocalDateTime.now();
////
////    // 🧍 Citizen who reported the issue
////    @ManyToOne(fetch = FetchType.LAZY)
////    @JoinColumn(name = "citizen_id")
////    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "issuesReported", "assignedIssues"})
////    private User citizen;
////
////    // 👮 Officer assigned to handle this issue
////    @ManyToOne(fetch = FetchType.LAZY)
////    @JoinColumn(name = "assigned_officer_id")
////    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "issuesReported", "assignedIssues"})
////    private User assignedOfficer;
////}
///
//package com.regionalportal.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.annotation.JsonInclude;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
///**
// * Issue — represents an issue reported by a citizen.
// */
//@Entity
//@Table(name = "issues")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//@JsonInclude(JsonInclude.Include.NON_NULL)
//public class Issue {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String title;
//
//    @Column(length = 1000)
//    private String description;
//
//    private String category;
//    private String location;
//    private String priority;  // LOW / MEDIUM / HIGH
//    private String status;    // PENDING / ASSIGNED / IN_PROGRESS / RESOLVED
//
//    @Column(length = 1000)
//    private String officerComment;
//
//    // 🕒 Timeline Tracking Fields
//    private LocalDateTime createdAt = LocalDateTime.now(); // When reported
//    private LocalDateTime assignedAt; // When assigned by Admin
//    private LocalDateTime resolvedAt; // When resolved by Officer
//
//    // 📸 Image Upload Support
//    private String photoUrl; // Path to uploaded image
//
//    // 🧍 Citizen who reported the issue
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "citizen_id")
//    @JsonIgnoreProperties({
//            "hibernateLazyInitializer",
//            "handler",
//            "issuesReported",
//            "assignedIssues"
//    })
//    private User citizen;
//
//    // 👮 Officer assigned to handle this issue
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "assigned_officer_id")
//    @JsonIgnoreProperties({
//            "hibernateLazyInitializer",
//            "handler",
//            "issuesReported",
//            "assignedIssues"
//    })
//    private User assignedOfficer;
//}
 ////ssssssssssssssssssssssss
package com.regionalportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Table(name = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String category;
    private String location;
    private String priority;  // LOW / MEDIUM / HIGH
    private String status;    // PENDING / ASSIGNED / IN_PROGRESS / RESOLVED


    private String photoUrl;


    private String resolvedImageUrl;


    @Column(length = 1000)
    private String officerComment;


    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime assignedAt;
    private LocalDateTime resolvedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "issuesReported",
            "assignedIssues"
    })
    private User citizen;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "issuesReported",
            "assignedIssues"
    })
    private User assignedOfficer;
}
