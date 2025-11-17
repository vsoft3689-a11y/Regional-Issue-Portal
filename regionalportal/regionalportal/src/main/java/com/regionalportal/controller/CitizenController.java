
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/citizen")
public class CitizenController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;


    @PostMapping("/issues")
    public ResponseEntity<?> createIssue(@RequestBody Issue issueRequest, Authentication authentication) {
        String username = authentication.getName();
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Citizen not found: " + username));

        Issue issue = new Issue();
        issue.setTitle(issueRequest.getTitle());
        issue.setDescription(issueRequest.getDescription());
        issue.setLocation(issueRequest.getLocation());
        issue.setPriority(issueRequest.getPriority());
        issue.setStatus("PENDING");
        issue.setCitizen(citizen);
        issue.setCreatedAt(LocalDateTime.now());

        Issue savedIssue = issueRepository.save(issue);

        Map<String, Object> response = new HashMap<>();
        response.put("message", " Issue reported successfully by " + username);
        response.put("issue", savedIssue);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getMyIssues(Authentication authentication) {
        String username = authentication.getName();
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Citizen not found: " + username));

        List<Issue> issues = issueRepository.findByCitizen(citizen);
        return ResponseEntity.ok(issues);
    }


    @PostMapping("/issues/upload/{issueId}")
    public ResponseEntity<?> uploadIssueImage(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String username = authentication.getName();
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + issueId));

        if (!citizen.equals(issue.getCitizen())) {
            return ResponseEntity.status(403).body(" You are not the reporter of this issue.");
        }

        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/issues/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(file.getInputStream(), filePath);

            issue.setPhotoUrl("/uploads/issues/" + fileName);
            issueRepository.save(issue);

            Map<String, Object> response = new HashMap<>();
            response.put("message", " Image uploaded successfully for issue ID " + issueId);
            response.put("photoUrl", issue.getPhotoUrl());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(" Failed to upload image: " + e.getMessage());
        }
    }


    @PutMapping("/issues/reopen/{issueId}")
    public ResponseEntity<?> reopenIssue(@PathVariable Long issueId, Authentication authentication) {
        String username = authentication.getName();
        User citizen = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Citizen not found: " + username));

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found with ID: " + issueId));

        if (!citizen.equals(issue.getCitizen())) {
            return ResponseEntity.status(403).body("🚫 You can only reopen your own issues.");
        }

        if (!"RESOLVED".equalsIgnoreCase(issue.getStatus())) {
            return ResponseEntity.badRequest().body("⚠️ Only resolved issues can be reopened.");
        }

        // ✅ Reset fields for reopening
        issue.setStatus("REOPENED");
        issue.setResolvedImageUrl(null);
        issue.setResolvedAt(null);
        issue.setOfficerComment("Citizen has reopened this issue for further review.");
        issueRepository.save(issue);

        Map<String, Object> response = new HashMap<>();
        response.put("message", " Issue reopened successfully. Officer will recheck it soon.");
        response.put("issueId", issueId);
        return ResponseEntity.ok(response);
    }
}
