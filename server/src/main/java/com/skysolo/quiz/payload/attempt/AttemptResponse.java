package com.skysolo.quiz.payload.attempt;

import java.util.List;

public record AttemptResponse(
        int score,
        List<Integer> selectedAnswers
) { }
