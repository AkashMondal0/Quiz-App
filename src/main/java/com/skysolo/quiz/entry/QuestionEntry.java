package com.skysolo.quiz.entry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionEntry {
    private String text;

    private List<String> options;

    private Integer correctIndex;
}