package com.regionalportal.repository;

import com.regionalportal.entity.Issue;
import com.regionalportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {


    List<Issue> findByCitizen(User citizen);


    List<Issue> findByAssignedOfficer(User officer);


    long countByStatus(String status);


    long countByAssignedOfficerAndStatus(User officer, String status);


    List<Issue> findByStatus(String status);


    @Query("SELECT i.status, COUNT(i) FROM Issue i GROUP BY i.status")
    List<Object[]> getStatusStatistics();
}
