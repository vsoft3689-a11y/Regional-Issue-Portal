package com.regionalportal.service;

import com.regionalportal.entity.RegionalIssue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing RegionalIssue entities.
 * Handles creation, updates, deletion, and retrieval of citizen-reported issues.
 */
public interface RegionalIssueService {


    RegionalIssue save(RegionalIssue issue);


    RegionalIssue getById(Long id);


    Page<RegionalIssue> getAllPageable(Pageable pageable);


    Boolean delete(Long issueId);


    RegionalIssue update(Long id, RegionalIssue updatedIssue);
}
