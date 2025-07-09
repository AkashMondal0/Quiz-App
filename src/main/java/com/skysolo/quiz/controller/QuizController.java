package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.payload.request.QuizCreateRequest;
import com.skysolo.quiz.payload.respose.QuizResponse;
import com.skysolo.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/quizzes")
    public ResponseEntity<QuizResponse> createQuiz(
            @RequestBody @Valid QuizCreateRequest request
    ) {
        QuizEntry quiz = quizService.createQuiz(request);

        QuizResponse response = new QuizResponse(
                quiz.getId(),
                quiz.getEventId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDurationLimitSeconds(),
                quiz.getQuestions(),
                quiz.getCreatedAt()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/events/{eventId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getQuizzesByEvent(@PathVariable String eventId) {
        List<QuizEntry> quizzes = quizService.getQuizzesByEventId(eventId);

        List<QuizResponse> response = quizzes.stream()
                .map(q -> new QuizResponse(
                        q.getId(), q.getEventId(), q.getTitle(),
                        q.getDescription(), q.getDurationLimitSeconds(),
                        q.getQuestions(), q.getCreatedAt()))
                .toList();

        return ResponseEntity.ok(response);
    }
}

