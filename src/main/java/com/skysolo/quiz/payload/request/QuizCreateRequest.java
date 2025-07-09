package com.skysolo.quiz.payload.request;

import com.skysolo.quiz.entry.QuestionEntry;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizCreateRequest {
    @NotBlank
    private String eventId;

    @NotBlank
    private String title;

    private String description;

    private Integer durationLimitSeconds;

    @NotEmpty
    private List<QuestionEntry> questions;
}
