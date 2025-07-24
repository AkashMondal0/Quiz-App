package com.skysolo.quiz.payload.quiz;

// CreateQuizRequest.java
import java.util.List;

record QuestionDto(
        String text,
        List<String> options,
        Integer correctIndex
) { }
public record CreateQuizRequest(
        String eventId,
        String title,
        String description,
        boolean isDurationEnabled,
        int durationLimitSeconds,
        boolean sendEmailFeatureEnabled,
        boolean participantLimitEnabled,
        Integer participantLimit,
        boolean isPublic,
        List<QuestionDto> questions
) { }

