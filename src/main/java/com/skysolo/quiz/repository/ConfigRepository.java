package com.skysolo.quiz.repository;

import com.skysolo.quiz.entry.ConfigEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ConfigRepository extends MongoRepository<ConfigEntry, String> {}
