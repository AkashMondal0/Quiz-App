package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.AttemptEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface AttemptRepository extends MongoRepository<AttemptEntry, String> {
    Optional<AttemptEntry> findByUserIdAndQuizId(String userId, String quizId);
}