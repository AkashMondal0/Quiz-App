package com.skysolo.quiz.payload.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String message;
    private String username;
    private String email;
    private String role;
}
