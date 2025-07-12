package com.skysolo.quiz.payload.auth;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSummary {
    private String id;
    private String username;
    private String email;
    private String url;
    private String name;
}
