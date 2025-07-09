package com.skysolo.quiz.entry;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "events")
@Data
public class EventEntry {
    @Id
    private String id;

    private String organizationId;

    private String createdBy; // user ID

    private String title;

    private String description;

    private String accessType; // "public" or "private"

    private List<String> allowedEmails; // optional for private events

    private Date startAt;

    private Date endAt;

    private Date createdAt = new Date();
}
