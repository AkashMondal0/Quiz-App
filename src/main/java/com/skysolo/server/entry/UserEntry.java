package com.skysolo.server.entry;

import com.mongodb.lang.NonNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class UserEntry {
    @Id
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    @NonNull
    private String password;
    private LocalDate date = LocalDate.now();

    @DBRef
    private List<BookEntry> books = new ArrayList<>();  // 👈 All books created by this user
}
