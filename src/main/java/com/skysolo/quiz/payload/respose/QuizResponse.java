package com.skysolo.quiz.payload.respose;

import com.skysolo.quiz.entry.QuestionEntry;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private String id;
    private String eventId;
    private String title;
    private String description;
    private Integer durationLimitSeconds;
    private List<QuestionEntry> questions;
    private Date createdAt;
}

