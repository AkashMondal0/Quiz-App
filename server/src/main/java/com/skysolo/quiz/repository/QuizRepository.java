package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.entry.QuizEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends MongoRepository<QuizEntry, String> {
    List<EventEntry> findByUserId(String userId);
    List<QuizEntry> findAllByEventId(String eventId);
}

