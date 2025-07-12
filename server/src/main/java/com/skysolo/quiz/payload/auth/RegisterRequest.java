package com.skysolo.quiz.payload.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.ArrayList;

@Data
public class RegisterRequest {
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password must not be blank")
    private String password;
    @NotBlank(message = "Name must not be blank")
    private String username;
    @NotEmpty(message = "Roles list must not be empty")
    private ArrayList<@NotBlank(message = "Role must not be blank") String> roles = new ArrayList<>();
}
