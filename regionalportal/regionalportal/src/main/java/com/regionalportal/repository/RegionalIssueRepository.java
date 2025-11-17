package com.regionalportal.repository;

import com.regionalportal.entity.RegionalIssue;
import com.regionalportal.entity.IssueStatus;
import com.regionalportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RegionalIssueRepository extends JpaRepository<RegionalIssue, Long> {


    List<RegionalIssue> findByRegion(String region);


    List<RegionalIssue> findByCity(String city);


    List<RegionalIssue> findByStatus(IssueStatus status);


    List<RegionalIssue> findByAssignedTo(User officer);


    List<RegionalIssue> findByReportedBy(User citizen);
}
