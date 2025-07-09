package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.QuizAttemptEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizAttemptRepository extends MongoRepository<QuizAttemptEntry, String> {
    boolean existsByQuizIdAndUserId(String quizId, String userId);
}
