package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.*;
import com.skysolo.quiz.exception.BadRequestException;
import com.skysolo.quiz.exception.NotFoundException;
import com.skysolo.quiz.payload.attempt.AttemptResponse;
import com.skysolo.quiz.payload.attempt.CreateAttemptRequest;
import com.skysolo.quiz.payload.auth.UserSummary;
import com.skysolo.quiz.payload.quiz.CreateQuizRequest;
import com.skysolo.quiz.payload.quiz.QuizMapper;
import com.skysolo.quiz.repository.AttemptRepository;
import com.skysolo.quiz.repository.EventRepository;
import com.skysolo.quiz.repository.QuizRepository;
import com.skysolo.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AttemptRepository attemptRepository;


    @Transactional
    public QuizEntry createQuiz(CreateQuizRequest req) {
        try {
            EventEntry event = eventRepository.findById(req.eventId())
                    .orElseThrow(() -> new NotFoundException("Event not found"));

            UserSummary creator = userRepository.findSummaryById(req.creatorId())
                    .orElseThrow(() -> new NotFoundException("User not found"));

            QuizEntry quiz = QuizMapper.toQuiz(req, event, creator);

            quiz = quizRepository.save(quiz);

            event.setQuizCount(event.getQuizCount() + 1);
            eventRepository.save(event);

            return quiz;
        } catch (Exception e) {
            throw new BadRequestException("Failed to create quiz: " + e.getMessage());
        }
    }

    @Transactional
    public AttemptResponse createAttempt(CreateAttemptRequest req) {
        QuizEntry quiz = quizRepository.findById(req.quizId())
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        UserSummary user = userRepository.findSummaryById(req.userId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        // Check participant limit
        if (quiz.isParticipantLimitEnabled() &&
                quiz.getParticipantsCount() >= quiz.getParticipantLimit()) {
            throw new BadRequestException("Participant limit reached");
        }

        // Check if user is allowed
        if (quiz.getAllowUsers() != null && !quiz.getAllowUsers().isEmpty()) {
            boolean allowed = quiz.getAllowUsers().stream()
                    .anyMatch(u -> u.getId().equals(user.getId()));
            if (!allowed) {
                throw new BadRequestException("User not allowed to attempt this quiz");
            }
        }

        // Optional: check if user has already attempted
        boolean alreadyAttempted = quiz.getAttempts() != null &&
                quiz.getAttempts().stream().anyMatch(a -> a.getUser().getId().equals(user.getId()));
        if (alreadyAttempted) {
            throw new BadRequestException("User has already attempted this quiz");
        }

        // Score calculation (optional)
        int score = 0;
        List<QuestionEntry> questions = quiz.getQuestions();
        List<Integer> answers = req.selectedAnswers();

        for (int i = 0; i < Math.min(questions.size(), answers.size()); i++) {
            Integer correct = questions.get(i).getCorrectIndex();
            if (correct != null && correct >= 0 && correct.equals(answers.get(i))) {
                score++;
            }
        }

        AttemptEntry attempt = new AttemptEntry();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setSelectedAnswers(answers);
        attempt.setScore(score);
        attempt.setAttemptedAt(Instant.now().toString());

        AttemptEntry saved = attemptRepository.save(attempt);

        // Update quiz
        quiz.setAttemptCount(quiz.getAttemptCount() + 1);
        quiz.setParticipantsCount(quiz.getParticipantsCount() + 1);
        quiz.getAttempts().add(saved); // optional if stored in quiz
        quiz.getParticipants().add(user);
        quizRepository.save(quiz);

        return new AttemptResponse(
                saved.getScore(),
                saved.getSelectedAnswers()
        );
    }


}
