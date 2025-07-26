package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.*;
import com.skysolo.quiz.exception.BadRequestException;
import com.skysolo.quiz.exception.ConflictException;
import com.skysolo.quiz.exception.ForbiddenException;
import com.skysolo.quiz.exception.NotFoundException;
import com.skysolo.quiz.payload.attempt.AttemptResponse;
import com.skysolo.quiz.payload.attempt.CreateAttemptRequest;
import com.skysolo.quiz.payload.quiz.CreateQuizRequest;
import com.skysolo.quiz.payload.quiz.QuizMapper;
import com.skysolo.quiz.payload.quiz.QuizResponse;
import com.skysolo.quiz.repository.AttemptRepository;
import com.skysolo.quiz.repository.EventRepository;
import com.skysolo.quiz.repository.QuizRepository;
import com.skysolo.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

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
    @Autowired
    private AuthService authService;


    private String getUserId() {
        String userId = authService.getSession().getBody().getId();

        if (userId == null || userId.isEmpty()) {
            throw new NotFoundException("User not found");
        }

        return userId;
    }


    @Transactional
    public QuizEntry createQuiz(CreateQuizRequest req) {
        try {
            String userId = getUserId();

            UserEntry creator = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));

            if(req.eventId().equals("EID") || req.eventId().isEmpty()) {
                // create quiz without event
                QuizEntry quiz = QuizMapper.toQuizWithOutEvent(req, creator);
                quiz = quizRepository.save(quiz);
                return quiz;
            }
            EventEntry event = eventRepository.findById(req.eventId())
                    .orElseThrow(() -> new NotFoundException("Event not found"));

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
        try {
            QuizEntry quiz = quizRepository.findById(req.quizId())
                    .orElseThrow(() -> new NotFoundException("Quiz not found"));

            String userId = getUserId();
            UserEntry user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));

            // Check participant limit
            if (quiz.isParticipantLimitEnabled() &&
                    quiz.getParticipantsCount() >= quiz.getParticipantLimit()) {
                throw new BadRequestException("Participant limit reached");
            }

            // Check if user is allowed
            if (quiz.getAllowUsers() != null && !quiz.getAllowUsers().isEmpty()) {
                boolean allowed = quiz.getAllowUsers().stream()
                        .filter(Objects::nonNull)
                        .anyMatch(u -> user.getId().equals(u.getId()));
                if (!allowed) {
                    throw new BadRequestException("User not allowed to attempt this quiz");
                }
            }

            // Check if user has already attempted
            if (quiz.getAttempts() != null) {
                boolean alreadyAttempted = quiz.getAttempts().stream()
                        .filter(Objects::nonNull)
                        .filter(a -> a.getUserId() != null)
                        .anyMatch(a -> user.getId().equals(a.getUserId()));
                if (alreadyAttempted) {
                    throw new ConflictException("User has already attempted this quiz");
                }
            }

            // Calculate score
            int score = 0;
            List<QuestionEntry> questions = quiz.getQuestions();
            List<Integer> answers = req.selectedAnswers();

            for (int i = 0; i < Math.min(questions.size(), answers.size()); i++) {
                Integer correct = questions.get(i).getCorrectIndex();
                if (correct != null && correct >= 0 && correct.equals(answers.get(i))) {
                    score++;
                }
            }

            // Create attempt
            AttemptEntry attempt = new AttemptEntry();
            attempt.setUserId(user.getId());
            attempt.setQuizId(quiz.getId());
            attempt.setSelectedAnswers(answers);
            attempt.setCorrectAnswers(quiz.getQuestions().stream()
                    .map(QuestionEntry::getCorrectIndex)
                    .toList());
            attempt.setScore(score);
            attempt.setAttemptedAt(Instant.now().toString());

            AttemptEntry saved = attemptRepository.save(attempt);

            // Update quiz metadata
            quiz.setAttemptCount(quiz.getAttemptCount() + 1);
            quiz.setParticipantsCount(quiz.getParticipantsCount() + 1);

            if (quiz.getAttempts() != null) {
                quiz.getAttempts().add(saved);
            }

            if (quiz.getParticipants() != null) {
                quiz.getParticipants().add(user);
            }

            quizRepository.save(quiz);

            return new AttemptResponse(saved.getScore(), saved.getSelectedAnswers());

        } catch (NotFoundException | BadRequestException | ConflictException e) {
            throw e; // rethrow known exceptions directly
        } catch (Exception e) {
            throw new BadRequestException("Failed to create attempt: " + e.getMessage());
        }
    }

    public List<QuizEntry> getQuizzesByEvent(String eventId) {
     try {
            EventEntry event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new NotFoundException("Event not found"));

            return quizRepository.findAllByEventId(event.getId());
        } catch (Exception e) {
            throw new BadRequestException("Failed to retrieve quizzes: " + e.getMessage());
        }
    }

    public QuizEntry getQuizById(String quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new NotFoundException("Quiz not found"));
    }

    public QuizResponse getQuizDetailsById(String quizId) {
        QuizEntry quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        return QuizMapper.toResponse(quiz);
    }

    @Transactional
    public QuizResponse getEligibleForAttemptQuiz(String quizId) {
       try {
           String userId = getUserId();

           QuizEntry quiz = quizRepository.findById(quizId)
                   .orElseThrow(() -> new RuntimeException("Quiz not found"));

           boolean isPrivate = !quiz.isPublic();

           if (isPrivate && (quiz.getAllowUsers() == null || quiz.getAllowUsers().stream()
                   .noneMatch(user -> user.getId().equals(userId)))) {
               throw new ForbiddenException("You are not allowed to attempt this private quiz.");
           }

           // ❌ If user already submitted (in participants)
           boolean alreadySubmitted = quiz.getParticipants().stream()
                   .anyMatch(user -> user.getId().equals(userId));
           if (alreadySubmitted) {
               throw new ForbiddenException("You have already submitted this quiz.");
           }

           // ✅ Allow only if user has not attempted before
           boolean hasAttempted = quiz.getAttempts().stream()
                   .anyMatch(a -> a.getUserId().equals(userId));

           if (hasAttempted) {
                throw new ForbiddenException("You have already attempted this quiz.");
           }

           return QuizMapper.toAttendResponse(quiz);
       } catch (NotFoundException e) {
           throw new NotFoundException("Quiz not found: " + e.getMessage());
       } catch (ForbiddenException e) {
           throw new ForbiddenException("Access denied: " + e.getMessage());
       } catch (Exception e) {
           throw new BadRequestException("Failed to attempt quiz: " + e.getMessage());
       }
    }

    public AttemptEntry getQuizResult(String quizId) {
        String userId = getUserId();
        return attemptRepository.findByUserIdAndQuizId(userId, quizId)
                .orElseThrow(() -> new NotFoundException("Quiz attempt not found for user"));
    }

    public  List<QuizEntry> getQuizzesByUserId () {
        String userId = getUserId();
        UserEntry user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<QuizEntry> quizzes = quizRepository.findAllByUserId(user.getId());
        if (quizzes.isEmpty()) {
            throw new NotFoundException("No quizzes found for this user");
        }
        return quizzes;
    }
}
