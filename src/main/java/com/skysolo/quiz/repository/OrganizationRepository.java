package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.OrganizationEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizationRepository extends MongoRepository<OrganizationEntry, String> {
    boolean existsByName(String name);
    List<OrganizationEntry> findByOwnerId(String ownerId);
}
