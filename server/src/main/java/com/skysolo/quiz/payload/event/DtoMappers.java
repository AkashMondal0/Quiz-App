package com.skysolo.quiz.payload.event;
import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.payload.auth.UserSummary;

import java.util.stream.Collectors;

public final class DtoMappers {

    private DtoMappers() { }

    public static UserSummary toSummary(UserSummary u) {
        return UserSummary.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .url(u.getUrl())
                .name(u.getName())
                .build();
    }

    public static QuizBrief toQuizBrief(QuizEntry q) {
        return QuizBrief.builder()
                .id(q.getId())
                .title(q.getTitle())
                .participantsCount(q.getParticipantsCount())
                .user(toSummary(q.getUser()))
                .allowUsers(q.getAllowUsers().stream()
                        .map(DtoMappers::toSummary)
                        .collect(Collectors.toList()))
                .participants(q.getParticipants().stream()
                        .map(DtoMappers::toSummary)
                        .collect(Collectors.toList()))
                .build();
    }

    public static EventWithRelations toEventWithRelations(EventEntry e) {
        return EventWithRelations.builder()
                .id(e.getId())
                .tag(e.getTag())
                .organizationId(e.getOrganizationId())
                .title(e.getTitle())
                .description(e.getDescription())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .sendEmailFeatureEnabled(e.isSendEmailFeatureEnabled())
                .isPublic(e.isPublic())
                .quizCount(e.getQuizCount())
                .participantsCount(e.getParticipantsCount())
                .user(toSummary(e.getUser()))
                .adminUsers(e.getAdminUsers().stream().map(DtoMappers::toSummary).collect(Collectors.toList()))
                .allowUsers(e.getAllowUsers().stream().map(DtoMappers::toSummary).collect(Collectors.toList()))
                .participants(e.getParticipants().stream().map(DtoMappers::toSummary).collect(Collectors.toList()))
                .quiz(e.getQuiz().stream().map(DtoMappers::toQuizBrief).collect(Collectors.toList()))
                .build();
    }
}
