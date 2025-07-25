package com.skysolo.quiz.exception;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> errorHandle(HttpStatus status,
                                            Exception ex,
                                            HttpServletRequest req,
                                            String error) {
        return Map.of(
                "status", status.value(),
                "error",  error,
                "message", ex.getMessage(),
                "path",   req.getRequestURI());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        return errorHandle(HttpStatus.NOT_FOUND, ex, request, "Not Found");
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
        return errorHandle(HttpStatus.BAD_REQUEST, ex, req, "Bad Request");
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleConflict(ConflictException ex, HttpServletRequest req) {
        return errorHandle(HttpStatus.CONFLICT, ex, req, "Conflict");
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, Object> handleForbidden(ForbiddenException ex, HttpServletRequest req) {
        return errorHandle(HttpStatus.FORBIDDEN, ex, req, "Forbidden");
    }
}

