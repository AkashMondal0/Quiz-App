package com.skysolo.server.service;

import com.skysolo.server.entry.UserEntry;
import com.skysolo.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserEntry> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<UserEntry> getUserById(String id) {
        return userRepository.findById(id);
    }

    public UserEntry createUser(UserEntry user) {
        return userRepository.save(user);
    }

    public UserEntry updateUser(String id, UserEntry user) {
        user.setId(id);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
