package com.skysolo.quiz.controller;

import com.skysolo.quiz.payload.event.*;
import com.skysolo.quiz.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
@RequiredArgsConstructor
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventCreateRequest request) {
        EventResponse created = eventService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/list")
    public ResponseEntity<List<EventMapper.EventSummary>> getAuthorEvents() {
        List<EventMapper.EventSummary> events = eventService.getEventsByAuthor();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventWithRelations> getEvent(@PathVariable String id) {
        EventWithRelations event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{eventId}/allow-users/add")
    public ResponseEntity<BulkAllowResponse> addAllowedUsers(
            @PathVariable String eventId,
            @Valid @RequestBody BulkAllowRequest body) {

        BulkAllowResponse resp = eventService.bulkAddAllowUsers(eventId, body.emails());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{eventId}/allow-users/remove")
    public ResponseEntity<BulkRemoveResponse> bulkRemoveAllowUsers(
            @PathVariable String eventId,
            @RequestBody @Valid BulkRemoveRequest request
    ) {
        BulkRemoveResponse response =
                eventService.bulkRemoveAllowUsers(eventId, request.emails());
        return ResponseEntity.ok(response);
    }

}

