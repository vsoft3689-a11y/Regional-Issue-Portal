package com.regionalportal.repository;

import com.regionalportal.entity.RegionalIssueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RegionalIssueHistoryRepository extends JpaRepository<RegionalIssueHistory, Long> {


    List<RegionalIssueHistory> findByRegionalIssueIdOrderById(Long regionalIssueId);
}
