package com.skysolo.quiz.payload.event;

import java.util.List;

public record BulkRemoveRequest(List<String> emails) { }
