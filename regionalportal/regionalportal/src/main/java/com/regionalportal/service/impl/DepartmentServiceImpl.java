package com.regionalportal.service.impl;

import com.regionalportal.entity.Department;
import com.regionalportal.entity.User;
import com.regionalportal.repository.DepartmentRepository;
import com.regionalportal.repository.UserRepository;
import com.regionalportal.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public DepartmentServiceImpl(DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Department save(Department department) {
        // Check for duplicate department code
        Department existing = departmentRepository.findByDepartmentCode(department.getDepartmentCode());
        if (existing != null) {
            throw new IllegalArgumentException("Department code already exists: " + department.getDepartmentCode());
        }

        // Assign manager if provided
        if (department.getManager() != null && department.getManager().getId() != null) {
            User manager = userRepository.findById(department.getManager().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + department.getManager().getId()));
            department.setManager(manager);
        }

        return departmentRepository.save(department);
    }

    @Override
    public Department getById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));
    }

    @Override
    public Department getByDepartmentCode(String departmentCode) {
        return departmentRepository.findByDepartmentCode(departmentCode);
    }

    @Override
    public List<Department> getByDepartmentCodeContains(String departmentCode) {
        return departmentRepository.findByDepartmentCodeContaining(departmentCode);
    }

    @Override
    public Page<Department> getAllPageable(Pageable pageable) {
        return departmentRepository.findAll(pageable);
    }

    @Override
    public Boolean delete(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Department not found for deletion with ID: " + id);
        }
        departmentRepository.deleteById(id);
        return true;
    }

    @Override
    public Department update(Long id, Department updatedDepartment) {
        Department departmentDb = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));

        // Check for duplicate code
        Department existing = departmentRepository.findByDepartmentCodeAndIdNot(updatedDepartment.getDepartmentCode(), id);
        if (existing != null) {
            throw new IllegalArgumentException("Department code already exists: " + updatedDepartment.getDepartmentCode());
        }

        departmentDb.setDepartmentCode(updatedDepartment.getDepartmentCode());
        departmentDb.setDepartmentName(updatedDepartment.getDepartmentName());

        if (updatedDepartment.getManager() != null && updatedDepartment.getManager().getId() != null) {
            User manager = userRepository.findById(updatedDepartment.getManager().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + updatedDepartment.getManager().getId()));
            departmentDb.setManager(manager);
        }

        return departmentRepository.save(departmentDb);
    }

    // Helper to get all departments without pagination
    public List<Department> getAll() {
        return departmentRepository.findAll();
    }
}
