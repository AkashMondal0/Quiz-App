package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.dto.CachedUserDTO;
import com.skysolo.quiz.payload.request.AuthRequest;
import com.skysolo.quiz.payload.respose.LoginResponse;
import com.skysolo.quiz.payload.respose.SessionResponse;
import com.skysolo.quiz.repository.UserRepository;
import com.skysolo.quiz.utils.UserInfoService;
import com.skysolo.quiz.utils.jwt.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final String PREFIX = "USER:";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserInfoService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public ResponseEntity<LoginResponse> register(@RequestBody UserEntry user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return buildErrorResponse("User already exists", HttpStatus.BAD_REQUEST);
        }

        try {
            String rawPassword = user.getPassword();
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            UserEntry newUser = userRepository.save(user);
            List<String> roles = newUser.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
            // Cache user
            CachedUserDTO cachedUser = new CachedUserDTO(
                    newUser.getId(),
                    newUser.getEmail(),
                    newUser.getPassword(),
                    roles,
                    newUser.getName(),
                    newUser.getUsername()
            );
            redisTemplate.opsForValue().set(PREFIX + user.getEmail(), cachedUser, 30, TimeUnit.DAYS);

            // Auto-login after registration
            return authenticateAndGenerateToken(user.getEmail(), rawPassword, "Registration successful");

        } catch (Exception e) {
            return buildErrorResponse("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<LoginResponse> login(@RequestBody AuthRequest request) {
        try {
            Object cached = redisTemplate.opsForValue().get(PREFIX + request.getEmail());

            if (cached instanceof CachedUserDTO cachedUser) {
                UserDetails userDetails = new User(
                        cachedUser.getEmail(),
                        cachedUser.getPassword(),
                        cachedUser.getRoles().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
                );

                String token = jwtService.generateToken(userDetails);
                return buildSuccessResponse(token, "User already logged in");
            }

            // Authenticate and cache
            return authenticateAndGenerateToken(request.getEmail(), request.getPassword(), "Login successful");

        } catch (BadCredentialsException e) {
            return buildErrorResponse("Invalid email or password", HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return buildErrorResponse("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ResponseEntity<LoginResponse> authenticateAndGenerateToken(String email, String rawPassword, String successMessage) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
        );

        if (authentication == null || !authentication.isAuthenticated()) {
            return buildErrorResponse("Authentication failed", HttpStatus.UNAUTHORIZED);
        }

        UserEntry user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        UserDetails userDetails = new User(
                user.getEmail(),
                user.getPassword(),
                user.getAuthorities()
        );

        // Extract roles
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        // Cache reconstructed DTO
        CachedUserDTO cache = new CachedUserDTO(
                user.getId(),
                userDetails.getUsername(),
                userDetails.getPassword(),
                roles,
                user.getName(),
                user.getUsername()
        );
        redisTemplate.opsForValue().set(PREFIX + email, cache, 30, TimeUnit.DAYS);

        String token = jwtService.generateToken(userDetails);
        return buildSuccessResponse(token, successMessage);
    }

    private ResponseEntity<LoginResponse> buildSuccessResponse(String token, String message) {
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMessage(message);
        return ResponseEntity.ok()
        .header("Set-Cookie", "token=" + token + "; HttpOnly; Path=/; Max-Age=2592000")
        .body(response);
    }

    private ResponseEntity<LoginResponse> buildErrorResponse(String message, HttpStatus status) {
        LoginResponse response = new LoginResponse();
        response.setToken(null);
        response.setMessage(message);
        return ResponseEntity.status(status).body(response);
    }

    public ResponseEntity<SessionResponse> getSession() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() ||
                    authentication.getName() == null || authentication.getName().isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = authentication.getName();
            String cacheKey = PREFIX + email;

            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached instanceof CachedUserDTO cachedUser) {
                return ResponseEntity.ok(toSessionResponse(cachedUser));
            }

            UserEntry user = userService.getUserByEmail(email);
            SessionResponse session = new SessionResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()),
                    user.getName(),
                    user.getUsername()
            );

            // Cache the session
            redisTemplate.opsForValue().set(cacheKey, session, 30, TimeUnit.DAYS);
            return ResponseEntity.ok(session);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private SessionResponse toSessionResponse(CachedUserDTO user) {
        return new SessionResponse(
                user.getId(),
                user.getEmail(),
                user.getRoles(),
                user.getName(),
                user.getUsername()
        );
    }
}
