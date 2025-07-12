package com.skysolo.quiz.entry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document("organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationEntry {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private String ownerId; // Just the String ID, no DBRef

    private Date createdAt = new Date();



}
