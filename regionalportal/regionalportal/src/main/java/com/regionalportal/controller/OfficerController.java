package com.regionalportal.controller;

import com.regionalportal.entity.Issue;
import com.regionalportal.entity.User;
import com.regionalportal.repository.IssueRepository;
import com.regionalportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/issues")
    public ResponseEntity<?> getAssignedIssues(Authentication authentication) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));


        List<Issue> assignedIssues = issueRepository.findByAssignedOfficer(officer);


        List<Issue> visibleIssues = assignedIssues.stream()
                .filter(issue -> {

                    if (!"RESOLVED".equalsIgnoreCase(issue.getStatus())) {
                        return true;
                    }


                    if (issue.getOfficerComment() == null || issue.getOfficerComment().isBlank()) {
                        return true;
                    }


                    if (issue.getResolvedImageUrl() == null || issue.getResolvedImageUrl().isBlank()) {
                        return true;
                    }


                    return false;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(visibleIssues);
    }


    @PutMapping("/issues/{id}")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable Long id,
            @RequestBody Issue updatedIssue,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + id));

        if (!officer.equals(issue.getAssignedOfficer())) {
            return ResponseEntity.status(403).body(" You are not assigned to this issue.");
        }

        if (updatedIssue.getStatus() != null) {
            issue.setStatus(updatedIssue.getStatus());
            if ("RESOLVED".equalsIgnoreCase(updatedIssue.getStatus())) {
                issue.setResolvedAt(LocalDateTime.now());
            }
        }


        if (updatedIssue.getOfficerComment() != null) {
            issue.setOfficerComment(updatedIssue.getOfficerComment());
        }

        issueRepository.save(issue);
        return ResponseEntity.ok(" Issue updated successfully by Officer " + username);
    }


    @PutMapping("/issues/{id}/comment")
    public ResponseEntity<?> addOfficerComment(
            @PathVariable Long id,
            @RequestBody String comment,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + id));

        if (!officer.equals(issue.getAssignedOfficer())) {
            return ResponseEntity.status(403).body(" You are not assigned to this issue.");
        }

        issue.setOfficerComment(comment);
        issueRepository.save(issue);

        return ResponseEntity.ok(" Comment added successfully for issue ID: " + id);
    }


    @PutMapping("/issues/{id}/status")
    public ResponseEntity<?> updateOnlyStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + id));

        if (!officer.equals(issue.getAssignedOfficer())) {
            return ResponseEntity.status(403).body(" You are not assigned to this issue.");
        }

        String newStatus = request.get("status");
        issue.setStatus(newStatus);

        if ("RESOLVED".equalsIgnoreCase(newStatus)) {
            issue.setResolvedAt(LocalDateTime.now());
        }

        issueRepository.save(issue);
        return ResponseEntity.ok("✅ Issue status updated to: " + newStatus);
    }


    @GetMapping("/issues/status/count")
    public ResponseEntity<?> getOfficerIssueStatusCount(Authentication authentication) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));

        List<Issue> assignedIssues = issueRepository.findByAssignedOfficer(officer);

        Map<String, Long> stats = new HashMap<>();
        stats.put("PENDING", assignedIssues.stream().filter(i -> "PENDING".equalsIgnoreCase(i.getStatus())).count());
        stats.put("ASSIGNED", assignedIssues.stream().filter(i -> "ASSIGNED".equalsIgnoreCase(i.getStatus())).count());
        stats.put("IN_PROGRESS", assignedIssues.stream().filter(i -> "IN_PROGRESS".equalsIgnoreCase(i.getStatus())).count());
        stats.put("REOPENED", assignedIssues.stream().filter(i -> "REOPENED".equalsIgnoreCase(i.getStatus())).count());
        stats.put("RESOLVED", assignedIssues.stream().filter(i -> "RESOLVED".equalsIgnoreCase(i.getStatus())).count());

        return ResponseEntity.ok(stats);
    }


    @PostMapping("/issues/upload/{issueId}")
    public ResponseEntity<?> uploadResolvedImage(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        String username = authentication.getName();
        User officer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Officer not found: " + username));

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + issueId));

        if (!officer.equals(issue.getAssignedOfficer())) {
            return ResponseEntity.status(403).body(" You are not assigned to this issue.");
        }

        try {

            String uploadDir = System.getProperty("user.dir") + "/uploads/resolved/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), filePath);


            issue.setResolvedImageUrl("/uploads/resolved/" + fileName);
            issue.setStatus("RESOLVED");
            issue.setResolvedAt(LocalDateTime.now());
            issueRepository.save(issue);

            Map<String, Object> response = new HashMap<>();
            response.put("message", " Resolved image uploaded successfully by Officer " + username);
            response.put("resolvedImageUrl", issue.getResolvedImageUrl());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(" Failed to upload image: " + e.getMessage());
        }
    }
}


