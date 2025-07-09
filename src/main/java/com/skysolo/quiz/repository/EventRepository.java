package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.EventEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<EventEntry, String> {
    List<EventEntry> findByOrganizationId(String organizationId);
    EventEntry findByIdAndOrganizationId(String organizationId, String eventId);
    List<EventEntry> findByCreatedBy(String createdBy);
}

