package com.skysolo.quiz.payload.event;

import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.payload.auth.UserSummary;

public class EventMapper {
    public record EventSummary(
            String id,
            String tag,
            String organizationId,
            String title,
            String description,
            String startDate,
            String endDate,
            String createdAt,
            String updatedAt,
            boolean sendEmailFeatureEnabled,
            boolean isPublic,
            int participantsCount,
            int quizCount,
            UserSummary user // just creator info
    ) { }
    public static EventSummary toEventSummary(EventEntry e) {
        UserSummary userEntry = new UserSummary(
                e.getUser().getId(),
                e.getUser().getUsername(),
                e.getUser().getEmail(),
                e.getUser().getUrl(),
                e.getUser().getName()
        );

        return new EventSummary(
                e.getId(),
                e.getTag(),
                e.getOrganizationId(),
                e.getTitle(),
                e.getDescription(),
                e.getStartDate(),
                e.getEndDate(),
                e.getCreatedAt(),
                e.getUpdatedAt(),
                e.isSendEmailFeatureEnabled(),
                e.isPublic(),
                e.getParticipantsCount(),
                e.getQuizCount(),
                userEntry
        );
    }
}

