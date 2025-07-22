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
                        ? req.questions().stream().map(q ->
                        new QuestionEntry(q.text(), q.options(), q.correctIndex())
                ).toList()
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
}

