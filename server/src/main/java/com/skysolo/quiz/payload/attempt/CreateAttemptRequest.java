package com.skysolo.quiz.payload.attempt;

import java.util.List;

public record CreateAttemptRequest(
        String quizId,
        String userId,
        List<Integer> selectedAnswers // indexed to questions
) { }
