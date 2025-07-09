package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.payload.request.QuizCreateRequest;
import com.skysolo.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public QuizEntry createQuiz(QuizCreateRequest request) {
        QuizEntry quiz = new QuizEntry();
        quiz.setEventId(request.getEventId());
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDurationLimitSeconds(request.getDurationLimitSeconds());
        quiz.setQuestions(request.getQuestions());
        quiz.setCreatedAt(new Date());

        return quizRepository.save(quiz);
    }

    public List<QuizEntry> getQuizzesByEventId(String eventId) {
        return quizRepository.findByEventId(eventId);
    }
}
