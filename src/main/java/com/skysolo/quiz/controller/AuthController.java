package com.skysolo.quiz.controller;
import com.skysolo.quiz.payload.dto.CachedUserDTO;
import com.skysolo.quiz.payload.request.AuthRequest;
import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.respose.LoginResponse;
import com.skysolo.quiz.payload.respose.SessionResponse;
import com.skysolo.quiz.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody UserEntry user) { return authService.register(user); }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody AuthRequest request) {
      return authService.login(request);
    }

    @GetMapping("/session")
    public ResponseEntity<SessionResponse> session() { return authService.getSession(); }
}

