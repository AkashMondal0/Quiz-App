package com.skysolo.quiz.entry;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "quizzes")
@Data
public class QuizEntry {
    @Id
    private String id;

    private String eventId;

    private String title;

    private String description;

    private Integer durationLimitSeconds; // optional

    private List<QuestionEntry> questions;

    private Date createdAt = new Date();
}
