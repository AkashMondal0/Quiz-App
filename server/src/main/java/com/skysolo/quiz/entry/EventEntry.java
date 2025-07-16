package com.skysolo.quiz.entry;

import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import lombok.*;

import java.util.ArrayList;

@Data                       // getters + setters
@NoArgsConstructor
@AllArgsConstructor
@Builder                     // enables fluent builders
@Document(collection = "events")   // change per model
public class EventEntry {
    @Id
    private String id;

    private String tag;
    private String organizationId;
    private String title;
    private String description;

    private String startDate;
    private String endDate;
    private String createdAt;
    private String updatedAt;

    private boolean sendEmailFeatureEnabled;
    private boolean isPublic;

    private int participantsCount;
    private int quizCount;

    @DBRef
    private UserSummary user; // Creator

    @Builder.Default
    @DBRef
    private List<UserSummary> adminUsers = new ArrayList<>();

    @Builder.Default
    @DBRef
    private List<UserSummary> allowUsers = new ArrayList<>();

    @Builder.Default
    @DBRef
    private List<UserSummary> participants = new ArrayList<>();

    @Builder.Default
    @DBRef
    private List<QuizEntry> quiz = new ArrayList<>();
}
