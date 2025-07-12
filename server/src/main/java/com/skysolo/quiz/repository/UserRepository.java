package com.skysolo.quiz.repository;
import com.skysolo.quiz.entry.UserEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntry, String> {
    Optional<UserEntry> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<UserEntry> findAllByEmailIn(Collection<String> emails);
}
