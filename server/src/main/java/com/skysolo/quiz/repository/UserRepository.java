package com.skysolo.quiz.repository;
import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.auth.UserSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntry, String> {
    Optional<UserEntry> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<UserSummary> findAllByIdIn(Collection<String> ids);
    List<UserSummary> findAllByEmailIn(Collection<String> emails);
    Optional<UserSummary> findSummaryByEmail(String email);
    Optional<UserSummary> findSummaryById(String id);
}
