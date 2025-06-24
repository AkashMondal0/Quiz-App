package com.skysolo.server.controller;

import com.skysolo.server.entry.UserEntry;
import com.skysolo.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserEntry> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<UserEntry> getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public UserEntry createUser(@RequestBody UserEntry user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public UserEntry updateUser(@PathVariable String id, @RequestBody UserEntry user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
