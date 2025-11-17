
package com.regionalportal.controller;

import com.regionalportal.entity.Issue;
import com.regionalportal.entity.User;
import com.regionalportal.repository.IssueRepository;
import com.regionalportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ✅ AdminController — Manages all issue operations, officer assignments, and admin dashboards.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getAllIssues() {
        List<Issue> issues = issueRepository.findAll();
        return ResponseEntity.ok(issues);
    }


    @GetMapping("/issues/{id}")
    public ResponseEntity<?> getIssueById(@PathVariable Long id) {
        return issueRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.badRequest()
                        .body("❌ Issue not found with ID: " + id));
    }


    @PutMapping("/assign/{issueId}")
    public ResponseEntity<?> assignIssueToOfficer(
            @PathVariable Long issueId,
            @RequestParam String officerUsername
    ) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException(" Issue not found with ID: " + issueId));

        User officer = userRepository.findByUsername(officerUsername)
                .orElseThrow(() -> new RuntimeException(" Officer not found with username: " + officerUsername));

        // Ensure assigned user is indeed an officer
        if (!"OFFICER".equalsIgnoreCase(officer.getRole().name())) {
            return ResponseEntity.badRequest()
                    .body(" User " + officerUsername + " is not an officer!");
        }

        issue.setAssignedOfficer(officer);
        issue.setStatus("ASSIGNED");
        issue.setAssignedAt(LocalDateTime.now());
        issueRepository.save(issue);

        return ResponseEntity.ok("✅ Officer " + officerUsername + " assigned to Issue ID " + issueId);
    }


    @PutMapping("/status/{issueId}")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable Long issueId,
            @RequestParam String status
    ) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("❌ Issue not found with ID: " + issueId));

        issue.setStatus(status.toUpperCase());

        // If admin marks it resolved manually
        if ("RESOLVED".equalsIgnoreCase(status)) {
            issue.setResolvedAt(LocalDateTime.now());
        }

        issueRepository.save(issue);
        return ResponseEntity.ok("✅ Issue " + issueId + " status updated to " + status.toUpperCase());
    }


    @PutMapping("/issues/{id}")
    public ResponseEntity<?> updateIssue(@PathVariable Long id, @RequestBody Issue updatedIssue) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Issue not found with ID: " + id));

        issue.setTitle(updatedIssue.getTitle());
        issue.setDescription(updatedIssue.getDescription());
        issue.setLocation(updatedIssue.getLocation());
        issue.setPriority(updatedIssue.getPriority());
        issue.setStatus(updatedIssue.getStatus());

        issueRepository.save(issue);
        return ResponseEntity.ok("✅ Issue updated successfully!");
    }


    @DeleteMapping("/issues/{id}")
    public ResponseEntity<?> deleteIssue(@PathVariable Long id) {
        if (!issueRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("❌ Issue not found with ID: " + id);
        }
        issueRepository.deleteById(id);
        return ResponseEntity.ok("🗑️ Issue deleted successfully (ID: " + id + ")");
    }


    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }


    @GetMapping("/officers")
    public ResponseEntity<List<Map<String, Object>>> getAllOfficers() {
        List<Map<String, Object>> officers = userRepository.findAll().stream()
                .filter(u -> "OFFICER".equalsIgnoreCase(u.getRole().name()))
                .map(u -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", u.getId());
                    data.put("username", u.getUsername());
                    data.put("email", u.getEmail());
                    return data;
                })
                .collect(Collectors.toList());

        if (officers.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(officers);
    }


    @GetMapping("/issues/status/count")
    public ResponseEntity<?> getIssueStatusCounts() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("PENDING", issueRepository.countByStatus("PENDING"));
        stats.put("ASSIGNED", issueRepository.countByStatus("ASSIGNED"));
        stats.put("IN_PROGRESS", issueRepository.countByStatus("IN_PROGRESS"));
        stats.put("RESOLVED", issueRepository.countByStatus("RESOLVED"));
        return ResponseEntity.ok(stats);
    }


    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalIssues", issueRepository.count());
        stats.put("resolvedIssues", issueRepository.countByStatus("RESOLVED"));
        stats.put("pendingIssues", issueRepository.countByStatus("PENDING"));
        return ResponseEntity.ok(stats);
    }
}
