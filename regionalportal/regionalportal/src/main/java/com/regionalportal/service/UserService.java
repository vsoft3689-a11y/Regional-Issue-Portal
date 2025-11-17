package com.regionalportal.service;

import com.regionalportal.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing User entities in the Regional Issue Portal.
 * Handles CRUD operations, authentication lookups, and user role management.
 */
public interface UserService {


    User save(User user);


    User getById(Long id);


    Page<User> getAllPageable(Pageable pageable);


    User getByUsername(String username);
}
