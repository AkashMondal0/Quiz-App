package com.skysolo.quiz.entry;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "quiz_attempts")
public class QuizAttemptEntry {

    @Id
    private String id;

    private String quizId;
    private String userId; // Can be email or username
    private List<Integer> selectedAnswers; // list of chosen option indices
    private int score;
    private Date attemptedAt = new Date();
}
