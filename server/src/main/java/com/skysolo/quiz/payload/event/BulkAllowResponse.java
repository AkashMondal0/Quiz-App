package com.skysolo.quiz.payload.event;


import java.util.List;

// response
public record BulkAllowResponse(
        List<String> added,
        List<String> skipped,
        List<String> missing,
        EventWithRelations event) { }
