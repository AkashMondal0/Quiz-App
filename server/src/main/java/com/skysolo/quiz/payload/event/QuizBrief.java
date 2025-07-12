package com.skysolo.quiz.payload.event;
import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuizBrief {
    private String id;
    private String title;
    private int participantsCount;

    private UserSummary user;                // creator

    @Builder.Default
    private List<UserSummary> allowUsers = new ArrayList<>();

    @Builder.Default
    private List<UserSummary> participants = new ArrayList<>();
}
