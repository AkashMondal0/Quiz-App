package com.skysolo.quiz.entry;

import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "quizzes")
public class QuizEntry {
    @Id
    private String id;

    private String eventId;
    private String title;
    private String description;
    private String createdAt;
    private String endedAt;
    private String startedAt;

    private boolean isDurationEnabled;
    private int durationLimitSeconds;
    private boolean participantLimitEnabled;
    private Integer participantLimit;
    private boolean sendEmailFeatureEnabled;
    private boolean isPublic;
    private int attemptCount;
    private int participantsCount;

    @Builder.Default
    private List<QuestionEntry> questions = new ArrayList<>();

    @DBRef
    private UserEntry user; // Creator

    @Builder.Default
    @DBRef
    private List<UserEntry> allowUsers = new ArrayList<>();

    @Builder.Default
    @DBRef
    private List<UserEntry> participants = new ArrayList<>();

    @Builder.Default
    private List<AttemptEntry> attempts = new ArrayList<>();
}
