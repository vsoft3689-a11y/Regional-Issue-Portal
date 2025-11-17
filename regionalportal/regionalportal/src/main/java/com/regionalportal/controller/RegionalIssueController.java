package com.regionalportal.controller;

import com.regionalportal.entity.IssueStatus;
import com.regionalportal.entity.RegionalIssue;
import com.regionalportal.service.impl.RegionalIssueServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;


@RestController
@RequestMapping("/api/regional-issues")

public class RegionalIssueController {

    private final RegionalIssueServiceImpl regionalIssueService;

    @Autowired
    public RegionalIssueController(RegionalIssueServiceImpl regionalIssueService) {
        this.regionalIssueService = regionalIssueService;
    }


    @GetMapping("/pagination")

    public ResponseEntity<Page<RegionalIssue>> getAllPaginated(Pageable pageable) {
        Page<RegionalIssue> data = regionalIssueService.getAllPageable(pageable);
        return ResponseEntity.ok(data);
    }


    @GetMapping("/{id}")

    public ResponseEntity<RegionalIssue> getById(@PathVariable Long id) {
        RegionalIssue issue = regionalIssueService.getById(id);
        if (issue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(issue);
    }


    @PostMapping

    public ResponseEntity<RegionalIssue> createIssue(@RequestBody RegionalIssue issue) {
        RegionalIssue saved = regionalIssueService.save(issue);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}")

    public ResponseEntity<RegionalIssue> updateIssue(@PathVariable Long id, @RequestBody RegionalIssue updatedIssue) {
        RegionalIssue result = regionalIssueService.update(id, updatedIssue);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }


    @DeleteMapping("/{id}")

    public ResponseEntity<Boolean> delete(@PathVariable Long id) {
        Boolean deleted = regionalIssueService.delete(id);
        return ResponseEntity.ok(deleted);
    }


    @GetMapping("/statuses")

    public ResponseEntity<List<IssueStatus>> getAllStatuses() {
        return ResponseEntity.ok(Arrays.asList(IssueStatus.values()));
    }


    @GetMapping

    public ResponseEntity<List<RegionalIssue>> getAllIssues() {
        return ResponseEntity.ok(regionalIssueService.getAll());
    }
}
