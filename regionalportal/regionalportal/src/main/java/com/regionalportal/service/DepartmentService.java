package com.regionalportal.service;

import com.regionalportal.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface DepartmentService {


    Department save(Department department);


    Department getById(Long id);


    Department getByDepartmentCode(String departmentCode);


    List<Department> getByDepartmentCodeContains(String departmentCode);


    Page<Department> getAllPageable(Pageable pageable);


    Boolean delete(Long id);


    Department update(Long id, Department updatedDepartment);
}
