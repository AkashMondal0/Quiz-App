package com.skysolo.quiz.controller;
import com.skysolo.quiz.payload.auth.LoginRequest;
import com.skysolo.quiz.payload.auth.RegisterRequest;
import com.skysolo.quiz.payload.auth.LoginResponse;
import com.skysolo.quiz.payload.auth.SessionResponse;
import com.skysolo.quiz.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) { return authService.register(request); }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
      return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Boolean> logOut() {
        return authService.logout();
    }

    @GetMapping("/session")
    public ResponseEntity<SessionResponse> session() { return authService.getSession(); }
}

