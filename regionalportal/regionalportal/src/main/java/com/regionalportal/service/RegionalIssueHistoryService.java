package com.regionalportal.service;

import com.regionalportal.entity.RegionalIssue;
import com.regionalportal.entity.RegionalIssueHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface RegionalIssueHistoryService {


    RegionalIssueHistory save(RegionalIssueHistory history);


    RegionalIssueHistory getById(Long id);


    List<RegionalIssueHistory> getByRegionalIssueId(Long issueId);


    Page<RegionalIssueHistory> getAllPageable(Pageable pageable);


    Boolean delete(Long id);


    void addHistory(Long issueId, RegionalIssue regionalIssue);
}
