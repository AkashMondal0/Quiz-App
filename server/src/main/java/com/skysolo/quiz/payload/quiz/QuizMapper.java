package com.skysolo.quiz.payload.quiz;

import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.entry.QuestionEntry;
import com.skysolo.quiz.entry.QuizEntry;
import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.auth.UserSummary;

import java.time.Instant;
import java.util.List;

public class QuizMapper {

        public static QuizEntry toQuiz(CreateQuizRequest req, EventEntry event, UserEntry creator) {
                List<QuestionEntry> questions = req.questions() != null
                        ? req.questions().stream()
                        .map(q -> new QuestionEntry(q.text(), q.options(), q.correctIndex()))
                        .toList()
                        : List.of();

                QuizEntry quiz = new QuizEntry();

                quiz.setEventId(event.getId());
                quiz.setTitle(req.title());
                quiz.setDescription(req.description());
                quiz.setDurationEnabled(req.isDurationEnabled());
                quiz.setDurationLimitSeconds(req.durationLimitSeconds());
                quiz.setSendEmailFeatureEnabled(req.sendEmailFeatureEnabled());
                quiz.setParticipantLimitEnabled(req.participantLimitEnabled());
                quiz.setParticipantLimit(req.participantLimit());
                quiz.setPublic(req.isPublic());
                quiz.setQuestions(questions);
                quiz.setUser(creator);
                quiz.setCreatedAt(Instant.now().toString());
                quiz.setAttemptCount(0);
                quiz.setParticipantsCount(0);

                return quiz;
        }

        public static QuizResponse toResponse(QuizEntry q) {
                UserSummary creator = toUserSummary(q.getUser());

                List<UserSummary> allowUsers = q.getAllowUsers().stream()
                        .map(QuizMapper::toUserSummary)
                        .toList();

                List<UserSummary> participants = q.getParticipants().stream()
                        .map(QuizMapper::toUserSummary)
                        .toList();

                List<QuizResponse.QuestionResponse> questions = q.getQuestions().stream()
                        .map(qst -> new QuizResponse.QuestionResponse(
                                qst.getText(),
                                qst.getOptions(),
                                qst.getCorrectIndex()
                        ))
                        .toList();

                List<QuizResponse.AttemptResponse> attempts = q.getAttempts().stream()
                        .map(a -> new QuizResponse.AttemptResponse(
                                a.getId(),
                                a.getUser() != null ? a.getUser().getId() : null,
                                a.getScore(),
                                a.getAttemptedAt()
                        ))
                        .toList();

                return new QuizResponse(
                        q.getId(),
                        q.getEventId(),
                        q.getTitle(),
                        q.getDescription(),
                        q.getCreatedAt(),
                        q.getStartedAt(),
                        q.getEndedAt(),
                        q.isDurationEnabled(),
                        q.getDurationLimitSeconds(),
                        q.isParticipantLimitEnabled(),
                        q.getParticipantLimit(),
                        q.isSendEmailFeatureEnabled(),
                        q.isPublic(),
                        q.getAttemptCount(),
                        q.getParticipantsCount(),
                        creator,
                        allowUsers,
                        participants,
                        questions,
                        attempts
                );
        }

        public static UserSummary toUserSummary(UserEntry user) {
                return new UserSummary(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getUrl(),
                        user.getName()
                );
        }

        public static QuizResponse toAttendResponse(QuizEntry q) {
                UserSummary creator = toUserSummary(q.getUser());

                List<QuizResponse.QuestionResponse> questions = q.getQuestions().stream()
                        .map(qst -> new QuizResponse.QuestionResponse(
                                qst.getText(),
                                qst.getOptions(),
                                -1 // hide correct answer
                        ))
                        .toList();

                return new QuizResponse(
                        q.getId(),
                        q.getEventId(),
                        q.getTitle(),
                        q.getDescription(),
                        q.getCreatedAt(),
                        q.getStartedAt(),
                        q.getEndedAt(),
                        q.isDurationEnabled(),
                        q.getDurationLimitSeconds(),
                        q.isParticipantLimitEnabled(),
                        q.getParticipantLimit(),
                        q.isSendEmailFeatureEnabled(),
                        q.isPublic(),
                        q.getAttemptCount(),
                        q.getParticipantsCount(),
                        creator,
                        List.of(), // allowUsers
                        List.of(), // participants
                        questions,
                        List.of()
                );
        }

}
