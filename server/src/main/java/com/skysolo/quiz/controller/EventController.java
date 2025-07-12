package com.skysolo.quiz.controller;

import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.payload.event.*;
import com.skysolo.quiz.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
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

        URI location = URI.create("/api/events/" + created.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .location(location)
                .body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventWithRelations> getEvent(@PathVariable String id) {
        EventWithRelations event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{eventId}/{identifier}")
    public ResponseEntity<EventWithRelations> addAllowedUser(@PathVariable String eventId,
                                                             @PathVariable String identifier) {

        EventWithRelations updated = eventService.addUserToAllowList(eventId, identifier);
        return ResponseEntity.created(URI.create("/api/events/" + eventId)).body(updated);
    }

    @PostMapping("/{eventId}/allow-users")
    public ResponseEntity<BulkAllowResponse> bulkAllow(
            @PathVariable String eventId,
            @Valid @RequestBody BulkAllowRequest body) {

        BulkAllowResponse resp =
                eventService.bulkAddAllowUsers(eventId, body.emails());

        return ResponseEntity.ok(resp);
    }

}

