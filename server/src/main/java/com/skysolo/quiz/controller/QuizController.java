package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.AttemptEntry;
import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.payload.attempt.AttemptResponse;
import com.skysolo.quiz.payload.attempt.CreateAttemptRequest;
import com.skysolo.quiz.payload.quiz.CreateQuizRequest;
import com.skysolo.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping()
    public ResponseEntity<QuizEntry> createQuiz(@RequestBody @Valid CreateQuizRequest request) {
        QuizEntry quiz = quizService.createQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(quiz);
    }

    @PostMapping("/attempt")
    public ResponseEntity<AttemptResponse> createAttempt(@RequestBody @Valid CreateAttemptRequest req) {
        AttemptResponse attempt = quizService.createAttempt(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(attempt);
    }

}
