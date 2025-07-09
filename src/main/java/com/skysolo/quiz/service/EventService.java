package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.EventCreateRequest;
import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.payload.respose.EventResponse;
import com.skysolo.quiz.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final AuthService authService;

    public ResponseEntity<EventResponse> createEvent(EventCreateRequest request) {
        try{
            String uid = authService.getSession().getBody().getId();

            if (uid == null || uid.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(null);
            }

            EventEntry event = getEventEntry(request, uid);

            EventEntry savedEvent = eventRepository.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new EventResponse(
                            savedEvent.getId(),
                            savedEvent.getOrganizationId(),
                            savedEvent.getCreatedBy(),
                            savedEvent.getTitle(),
                            savedEvent.getDescription(),
                            savedEvent.getAccessType(),
                            savedEvent.getAllowedEmails(),
                            savedEvent.getStartAt(),
                            savedEvent.getEndAt(),
                            savedEvent.getCreatedAt()
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    private static EventEntry getEventEntry(EventCreateRequest request, String uid) {
        EventEntry event = new EventEntry();
        event.setOrganizationId(request.getOrganizationId());
        event.setCreatedBy(uid);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setAccessType(request.getAccessType());
        event.setAllowedEmails(request.getAllowedEmails());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setCreatedAt(new Date());
        return event;
    }

    public ResponseEntity<List<EventResponse>> getEventsByOrganization(String orgId) {
        try {
            List<EventEntry> events = eventRepository.findByOrganizationId(orgId);
            if (events.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            List<EventResponse> responses = events.stream()
                    .map(event -> new EventResponse(
                            event.getId(),
                            event.getOrganizationId(),
                            event.getCreatedBy(),
                            event.getTitle(),
                            event.getDescription(),
                            event.getAccessType(),
                            event.getAllowedEmails(),
                            event.getStartAt(),
                            event.getEndAt(),
                            event.getCreatedAt()
                    )).toList();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    public ResponseEntity<EventResponse> getEventById(String orgId, String eventId) {
        try {
            EventEntry event = eventRepository.findByIdAndOrganizationId(eventId, orgId);
            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            EventResponse response = new EventResponse(
                    event.getId(),
                    event.getOrganizationId(),
                    event.getCreatedBy(),
                    event.getTitle(),
                    event.getDescription(),
                    event.getAccessType(),
                    event.getAllowedEmails(),
                    event.getStartAt(),
                    event.getEndAt(),
                    event.getCreatedAt()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

