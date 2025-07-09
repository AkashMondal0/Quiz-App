package com.skysolo.quiz.payload.request;

import lombok.Data;

import java.util.List;

@Data
public class AttemptRequest {
    private String quizId;
    private String userId;
    private List<Integer> answers;
}
