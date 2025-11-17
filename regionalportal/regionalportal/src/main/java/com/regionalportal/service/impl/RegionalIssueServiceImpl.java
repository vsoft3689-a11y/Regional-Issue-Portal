package com.regionalportal.service.impl;

import com.regionalportal.entity.*;
import com.regionalportal.repository.DepartmentRepository;
import com.regionalportal.repository.RegionalIssueRepository;
import com.regionalportal.repository.UserRepository;
import com.regionalportal.service.RegionalIssueHistoryService;
import com.regionalportal.service.RegionalIssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class RegionalIssueServiceImpl implements RegionalIssueService {

    private final RegionalIssueRepository issueRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final RegionalIssueHistoryService issueHistoryService;

    @Autowired
    public RegionalIssueServiceImpl(RegionalIssueRepository issueRepository,
                                    DepartmentRepository departmentRepository,
                                    UserRepository userRepository,
                                    RegionalIssueHistoryService issueHistoryService) {
        this.issueRepository = issueRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.issueHistoryService = issueHistoryService;
    }

    @Override
    public RegionalIssue save(RegionalIssue issue) {
        // Default behavior for new issue
        issue.setReportedDate(LocalDateTime.now());
        issue.setStatus(IssueStatus.NEW);

        // Ensure linked department is loaded
        if (issue.getDepartment() != null && issue.getDepartment().getId() != null) {
            departmentRepository.findById(issue.getDepartment().getId())
                    .ifPresent(issue::setDepartment);
        }

        // Ensure linked citizen is loaded
        if (issue.getReportedBy() != null && issue.getReportedBy().getId() != null) {
            userRepository.findById(issue.getReportedBy().getId())
                    .ifPresent(issue::setReportedBy);
        }

        return issueRepository.save(issue);
    }

    @Override
    public RegionalIssue getById(Long id) {
        return issueRepository.findById(id).orElse(null);
    }

    @Override
    public Page<RegionalIssue> getAllPageable(Pageable pageable) {
        return issueRepository.findAll(pageable);
    }

    @Override
    public Boolean delete(Long issueId) {
        if (issueRepository.existsById(issueId)) {
            issueRepository.deleteById(issueId);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public RegionalIssue update(Long id, RegionalIssue updatedIssue) {
        Optional<RegionalIssue> existingOpt = issueRepository.findById(id);
        if (existingOpt.isEmpty()) return null;

        RegionalIssue issueDb = existingOpt.get();

        // Keep a history of changes before updating
        issueHistoryService.addHistory(id, issueDb);

        // Apply updates
        issueDb.setDescription(updatedIssue.getDescription());
        issueDb.setDetails(updatedIssue.getDetails());
        issueDb.setStatus(updatedIssue.getStatus());
        issueDb.setReportedDate(LocalDateTime.now());
        issueDb.setAddress(updatedIssue.getAddress());
        issueDb.setPhotoUrl(updatedIssue.getPhotoUrl());

        if (updatedIssue.getAssignedTo() != null && updatedIssue.getAssignedTo().getId() != null) {
            userRepository.findById(updatedIssue.getAssignedTo().getId())
                    .ifPresent(issueDb::setAssignedTo);
        }

        if (updatedIssue.getDepartment() != null && updatedIssue.getDepartment().getId() != null) {
            departmentRepository.findById(updatedIssue.getDepartment().getId())
                    .ifPresent(issueDb::setDepartment);
        }

        return issueRepository.save(issueDb);
    }

    // 🔹 Helper method — get all issues without pagination
    public List<RegionalIssue> getAll() {
        return issueRepository.findAll();
    }
}
