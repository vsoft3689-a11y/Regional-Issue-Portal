package com.regionalportal.dto;

import com.regionalportal.entity.IssueStatus;
import com.regionalportal.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionalIssueHistoryResponse {

    private Long id;
    private String description;
    private String details;
    private Date updatedAt;
    private IssueStatus issueStatus;
    private User updatedByOfficer;
}
