package com.skysolo.quiz.payload.event;

import java.util.List;

public record BulkRemoveResponse(
        List<String> removed,
        List<String> notFound,
        List<String> notInList,
        EventWithRelations event
) { }