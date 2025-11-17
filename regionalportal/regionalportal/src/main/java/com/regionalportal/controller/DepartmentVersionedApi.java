package com.regionalportal.controller;

import com.regionalportal.entity.Department;
import com.regionalportal.service.impl.DepartmentServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/versioning/departments")

public class DepartmentVersionedApi {

    private final DepartmentServiceImpl departmentServiceImpl;

    @Autowired
    public DepartmentVersionedApi(DepartmentServiceImpl departmentServiceImpl) {
        this.departmentServiceImpl = departmentServiceImpl;
    }


    @GetMapping(value = "/{id}", params = "version=1")

    public ResponseEntity<Department> getByIdV1(@PathVariable Long id) {
        Department department = departmentServiceImpl.getById(id);
        return ResponseEntity.ok(department);
    }


    @GetMapping(value = "/{id}", params = "version=2")

    public ResponseEntity<Department> getByIdV2(@PathVariable Long id) {
        Department department = departmentServiceImpl.getById(id);
        // In the future, V2 might include extra computed fields, logs, etc.
        return ResponseEntity.ok(department);
    }
}
