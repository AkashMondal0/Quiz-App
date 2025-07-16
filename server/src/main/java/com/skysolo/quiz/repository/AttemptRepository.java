package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.AttemptEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AttemptRepository extends MongoRepository<AttemptEntry, String> {

}