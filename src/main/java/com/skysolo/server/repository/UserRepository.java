package com.skysolo.server.repository;

import com.skysolo.server.entry.UserEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<UserEntry, String> {
    // Custom queries can be added here
}
