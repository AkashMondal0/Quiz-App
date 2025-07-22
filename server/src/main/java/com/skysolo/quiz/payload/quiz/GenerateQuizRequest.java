package com.skysolo.quiz.payload.quiz;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenerateQuizRequest {
    @NotNull
    String topic;            // You can make this dynamic
    int numberOfQuestions = 10;        // You can pass this in as a parameter
    String difficulty = "easy";     // Options: "easy", "medium", "hard"
}
