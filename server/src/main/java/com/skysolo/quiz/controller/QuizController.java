package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.AttemptEntry;
import com.skysolo.quiz.entry.QuestionEntry;
import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.payload.attempt.AttemptResponse;
import com.skysolo.quiz.payload.attempt.CreateAttemptRequest;
import com.skysolo.quiz.payload.quiz.CreateQuizRequest;
import com.skysolo.quiz.payload.quiz.GenerateQuizRequest;
import com.skysolo.quiz.payload.quiz.QuizResponse;
import com.skysolo.quiz.service.GeminiService;
import com.skysolo.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
public class QuizController {

    @Autowired
    private QuizService quizService;
    @Autowired
    private GeminiService geminiService;


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

    @GetMapping("/{eventId}/list")
    public ResponseEntity<List<QuizEntry>> getQuizzesByEvent(@PathVariable String eventId) {
        List<QuizEntry> quizzes = quizService.getQuizzesByEvent(eventId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/list")
    public ResponseEntity<List<QuizEntry>> getQuizzesByEvent() {
        List<QuizEntry> quizzes = quizService.getQuizzesByUserId();
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizEntry> getQuizById(@PathVariable String quizId) {
        QuizEntry quiz = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/{quizId}/details")
    public ResponseEntity<QuizResponse> getQuizDetailsById(@PathVariable String quizId) {
        QuizResponse quiz = quizService.getQuizDetailsById(quizId);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/{quizId}/attempt")
    public ResponseEntity<QuizResponse> getEligibleForAttemptQuiz(@PathVariable String quizId) {
        QuizResponse attempt = quizService.getEligibleForAttemptQuiz(quizId);
        return ResponseEntity.ok(attempt);
    }

    @PostMapping("/generate")
    public ResponseEntity<List<QuestionEntry>> generateQuiz(@RequestBody @Valid GenerateQuizRequest request) {
        List<QuestionEntry> attempts = geminiService.generateQuizQuestions(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(attempts);
    }

    @GetMapping("/result/{quizId}")
    public ResponseEntity<AttemptEntry> getQuizResult(@PathVariable String quizId) {
        AttemptEntry quizResult = quizService.getQuizResult(quizId);
        return ResponseEntity.ok(quizResult);
    }

}
