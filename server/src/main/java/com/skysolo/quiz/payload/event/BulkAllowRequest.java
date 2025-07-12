package com.skysolo.quiz.payload.event;

import java.util.List;

public record BulkAllowRequest(List<String> emails) { }
