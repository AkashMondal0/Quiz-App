package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.EventCreateRequest;
import com.skysolo.quiz.payload.respose.EventResponse;
import com.skysolo.quiz.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping("/event")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventCreateRequest request
    ) {
        return eventService.createEvent(request);
    }

    @GetMapping("/{orgId}/events")
    public ResponseEntity<List<EventResponse>> getEventsByOrganization(
            @PathVariable String orgId
    ) {
      return eventService.getEventsByOrganization(orgId);
    }

    @GetMapping("/{orgId}/{eventId}")
    public ResponseEntity<EventResponse> getEventById(
            @PathVariable String orgId,
            @PathVariable String eventId
    ) {
        return eventService.getEventById(orgId, eventId);
    }
}

