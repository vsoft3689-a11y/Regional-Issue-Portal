package com.regionalportal.dto;

import com.regionalportal.entity.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegionalIssueUpdateRequest {

    private Long id;
    private String description;
    private String details;
    private Date updatedAt;
    private IssueStatus issueStatus;
    private Long assigneeId;
    private Long departmentId;
}
