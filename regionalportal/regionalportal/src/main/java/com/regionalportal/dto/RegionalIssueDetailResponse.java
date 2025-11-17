package com.regionalportal.dto;

import com.regionalportal.entity.IssueStatus;
import com.regionalportal.entity.RegionalIssueHistory;
import com.regionalportal.entity.User;
import com.regionalportal.entity.Department;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class RegionalIssueDetailResponse {


    private Long id;


    private String description;


    private String details;


    private Date reportedDate;


    private IssueStatus issueStatus;


    private User assignee;


    private Department department;


    private List<RegionalIssueHistory> issueHistories;
}
