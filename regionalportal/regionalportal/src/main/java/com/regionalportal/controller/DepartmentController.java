package com.regionalportal.controller;

import com.regionalportal.entity.Department;
import com.regionalportal.service.impl.DepartmentServiceImpl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/departments")
@Slf4j

public class DepartmentController {

    private final DepartmentServiceImpl departmentServiceImpl;

    @Autowired
    public DepartmentController(DepartmentServiceImpl departmentServiceImpl) {
        this.departmentServiceImpl = departmentServiceImpl;
    }


    @GetMapping("/pagination")

    public ResponseEntity<Page<Department>> getAllPaginated(Pageable pageable) {
        Page<Department> data = departmentServiceImpl.getAllPageable(pageable);
        return ResponseEntity.ok(data);
    }


    @GetMapping

    public ResponseEntity<List<Department>> getAll() {
        List<Department> data = departmentServiceImpl.getAll();
        return ResponseEntity.ok(data);
    }


    @GetMapping("/{id}")

    public ResponseEntity<Department> getById(@PathVariable Long id) {
        log.info("DepartmentController -> getById({})", id);
        Department department = departmentServiceImpl.getById(id);
        return ResponseEntity.ok(department);
    }


    @PostMapping

    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department saved = departmentServiceImpl.save(department);
        return ResponseEntity.ok(saved);
    }


    @PutMapping("/{id}")

    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @RequestBody Department updatedDepartment) {
        Department updated = departmentServiceImpl.update(id, updatedDepartment);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")

    public ResponseEntity<Boolean> deleteDepartment(@PathVariable Long id) {
        Boolean deleted = departmentServiceImpl.delete(id);
        return ResponseEntity.ok(deleted);
    }
}
