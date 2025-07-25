package com.skysolo.quiz.entry;

import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document("attempts")
public class AttemptEntry {
    @Id
    private String id;

    private String userId;

    private String quizId;

    private List<Integer> selectedAnswers;

    private String attemptedAt;

    private int score; // optional

    public UserSummary getUser() {
        return UserSummary.builder()
                .id(userId)
                .build();
    }
}

