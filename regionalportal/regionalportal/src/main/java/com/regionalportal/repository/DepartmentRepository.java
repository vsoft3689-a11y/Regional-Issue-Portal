package com.regionalportal.repository;

import com.regionalportal.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {


    Department findByDepartmentCode(String departmentCode);


    Department findByDepartmentCodeAndIdNot(String departmentCode, Long id);


    List<Department> findByDepartmentCodeContaining(String departmentCode);


    Page<Department> findAll(Pageable pageable);


    List<Department> findAll(Sort sort);
}
