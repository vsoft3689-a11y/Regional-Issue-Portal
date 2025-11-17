package com.regionalportal.controller;

import com.regionalportal.entity.User;
import com.regionalportal.service.impl.UserServiceImpl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")

@Slf4j
public class UserController {

    private final UserServiceImpl userServiceImpl;

    @Autowired
    public UserController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }


    @GetMapping("/pagination")

    public ResponseEntity<Page<User>> getAllPaginated(Pageable pageable) {
        Page<User> users = userServiceImpl.getAllPageable(pageable);
        return ResponseEntity.ok(users);
    }


    @GetMapping

    public ResponseEntity<List<User>> getAll() {
        List<User> data = userServiceImpl.getAll();
        return ResponseEntity.ok(data);
    }


    @GetMapping("/{id}")

    public ResponseEntity<User> getById(@PathVariable Long id) {
        log.info("UserController -> getById({})", id);
        User user = userServiceImpl.getById(id);
        return ResponseEntity.ok(user);
    }


    @PostMapping

    public ResponseEntity<User> createUser(@RequestBody User user) {
        log.info("UserController -> createUser({})", user.getUsername());
        User savedUser = userServiceImpl.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
