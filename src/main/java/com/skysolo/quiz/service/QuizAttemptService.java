package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.QuizAttemptEntry;
import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.repository.QuizAttemptRepository;
import com.skysolo.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public int calculateScore(QuizEntry quiz, List<Integer> answers) {
        int score = 0;
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            if (i < answers.size() && quiz.getQuestions().get(i).getCorrectIndex().equals(answers.get(i))) {
                score++;
            }
        }
        return score;
    }

    public ResponseEntity<QuizAttemptEntry> attemptQuiz(String quizId, String userId, List<Integer> answers) {
       try{
           QuizEntry quiz = quizRepository.findById(quizId).orElse(null);

           if (quiz == null) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
           }
           // check user already attempted the quiz
              if (quizAttemptRepository.existsByQuizIdAndUserId(quizId, userId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
              }

           int score = calculateScore(quiz, answers);

           QuizAttemptEntry attempt = new QuizAttemptEntry();
           attempt.setQuizId(quizId);
           attempt.setUserId(userId);
           attempt.setSelectedAnswers(answers);
           attempt.setScore(score);

           QuizAttemptEntry savedAttempt = quizAttemptRepository.save(attempt);
           return ResponseEntity.ok(savedAttempt);
       } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
    }
}
