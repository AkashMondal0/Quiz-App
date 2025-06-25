package com.skysolo.server.entry;

import com.mongodb.lang.NonNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "books")
public class BookEntry {
    @Id
    private String id;
    @NonNull
    private String title;
    private String about;
    private Long price;
    private LocalDate date = LocalDate.now();

}
