package com.skysolo.quiz.payload.event;

import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EventWithRelations {
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
    private int quizCount;
    private int participantsCount;

    private UserSummary user;                       // author

    @Builder.Default private List<UserSummary> adminUsers = new ArrayList<>();
    @Builder.Default private List<UserSummary> allowUsers = new ArrayList<>();
    @Builder.Default private List<UserSummary> participants = new ArrayList<>();

    @Builder.Default private List<QuizBrief> quiz = new ArrayList<>();
}
