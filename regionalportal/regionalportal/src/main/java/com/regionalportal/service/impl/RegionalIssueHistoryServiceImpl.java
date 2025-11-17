package com.regionalportal.service.impl;

import com.regionalportal.entity.RegionalIssue;
import com.regionalportal.entity.RegionalIssueHistory;
import com.regionalportal.repository.RegionalIssueHistoryRepository;
import com.regionalportal.service.RegionalIssueHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RegionalIssueHistoryServiceImpl implements RegionalIssueHistoryService {

    private final RegionalIssueHistoryRepository historyRepository;

    @Autowired
    public RegionalIssueHistoryServiceImpl(RegionalIssueHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @Override
    public RegionalIssueHistory save(RegionalIssueHistory history) {
        return historyRepository.save(history);
    }

    @Override
    public RegionalIssueHistory getById(Long id) {
        return historyRepository.findById(id).orElse(null);
    }

    @Override
    public List<RegionalIssueHistory> getByRegionalIssueId(Long issueId) {
        return historyRepository.findByRegionalIssueIdOrderById(issueId);
    }

    @Override
    public Page<RegionalIssueHistory> getAllPageable(Pageable pageable) {
        return historyRepository.findAll(pageable);
    }

    @Override
    public Boolean delete(Long id) {
        if (historyRepository.existsById(id)) {
            historyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public void addHistory(Long issueId, RegionalIssue issue) {
        RegionalIssueHistory history = new RegionalIssueHistory();
        history.setRegionalIssue(issue);
        history.setUpdatedByOfficer(issue.getAssignedTo());
        history.setUpdatedTime(issue.getReportedDate());
        history.setDescription(issue.getDescription());
        history.setDetails(issue.getDetails());
        history.setIssueStatus(issue.getStatus());
        historyRepository.save(history);
    }
}
