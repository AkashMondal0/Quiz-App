package com.skysolo.quiz.payload.quiz;

import com.skysolo.quiz.payload.auth.UserSummary;

import java.util.List;

public record QuizResponse(
        String id,
        String eventId,
        String title,
        String description,
        String createdAt,
        String startedAt,
        String endedAt,
        boolean isDurationEnabled,
        int durationLimitSeconds,
        boolean participantLimitEnabled,
        Integer participantLimit,
        boolean sendEmailFeatureEnabled,
        boolean isPublic,
        int attemptCount,
        int participantsCount,
        UserSummary creator,
        List<UserSummary> allowUsers,
        List<UserSummary> participants,
        List<QuestionResponse> questions,
        List<AttemptResponse> attempts
) {
    public record QuestionResponse(
            String text,
            List<String> options,
            int correctIndex
    ) {}

    public record AttemptResponse(
            String id,
            String userId,
            int score,
            String submittedAt,
             List<Integer> selectedAnswers,
            List<Integer> correctAnswers
    ) {}
}
