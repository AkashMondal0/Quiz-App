package com.skysolo.quiz.payload.attempt;

import java.util.List;

public record CreateAttemptRequest(
        String quizId,
        List<Integer> selectedAnswers // indexed to questions
) { }
