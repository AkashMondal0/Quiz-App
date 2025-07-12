package com.skysolo.quiz.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)          // <‑‑ add this
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
