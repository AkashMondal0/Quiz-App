package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.QuizAttemptEntry;
import com.skysolo.quiz.payload.request.AttemptRequest;
import com.skysolo.quiz.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    @PostMapping("/attempt")
    public ResponseEntity<QuizAttemptEntry> attemptQuiz(@RequestBody AttemptRequest request) {
        return quizAttemptService.attemptQuiz(request.getQuizId(), request.getUserId(), request.getAnswers());
    }
}
