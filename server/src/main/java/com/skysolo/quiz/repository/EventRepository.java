package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.EventEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<EventEntry, String> {

    boolean existsByOrganizationIdAndTag(String organizationId, String tag);
    List<EventEntry> findByUserId(String userId);
    List<EventEntry> findByStartDateAfterAndEndDateBefore(Date startDate, Date endDate);

    List<EventEntry> findByStartDateAfter(Date startDate);

    List<EventEntry> findByEndDateBefore(Date endDate);

    List<EventEntry> findByTitleContainingIgnoreCase(String title);

    List<EventEntry> findByDescriptionContainingIgnoreCase(String description);
}

