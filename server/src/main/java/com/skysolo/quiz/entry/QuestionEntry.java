package com.skysolo.quiz.entry;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionEntry {
    private String text;

    @Builder.Default
    private List<String> options = new ArrayList<>();

    private Integer correctIndex; // Can be null or -1
}