package com.skysolo.server.repository;

import com.skysolo.server.entry.BookEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<BookEntry, String> {
    // Add custom queries if needed
}