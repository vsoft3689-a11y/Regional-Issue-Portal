package com.regionalportal.dto;

import com.regionalportal.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {

    private Long id;

    @NotNull
    private String departmentName;

    @NotNull
    private String departmentCode;

    @NotNull
    private Long managerId;

    private User manager;
}
