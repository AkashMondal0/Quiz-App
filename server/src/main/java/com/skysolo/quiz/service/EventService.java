package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.exception.ConflictException;
import com.skysolo.quiz.exception.NotFoundException;
import com.skysolo.quiz.payload.event.*;
import com.skysolo.quiz.repository.EventRepository;
import com.skysolo.quiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthService authService;

    public EventResponse create(EventCreateRequest req) {

        String userId = authService.getSession().getBody().getId();

        UserEntry creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EventEntry saved = eventRepository.save(EventEntry.builder()
                .tag(req.getTag())
                .organizationId(req.getOrganizationId())
                .title(req.getTitle())
                .description(req.getDescription())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .createdAt(Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .sendEmailFeatureEnabled(req.isSendEmailFeatureEnabled())
                .isPublic(req.isPublic())
                .quizCount(0)
                .participantsCount(0)
                .user(creator)
                .adminUsers(new ArrayList<>())
                .allowUsers(new ArrayList<>())
                .participants(new ArrayList<>())
                .quiz(new ArrayList<>())
                .build());

        /* 3 ─ map to response */
        return EventResponse.builder()
                .id(saved.getId())
                .tag(saved.getTag())
                .organizationId(saved.getOrganizationId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .startDate(saved.getStartDate())
                .endDate(saved.getEndDate())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .sendEmailFeatureEnabled(saved.isSendEmailFeatureEnabled())
                .isPublic(saved.isPublic())
                .quizCount(saved.getQuizCount())
                .participantsCount(saved.getParticipantsCount())
                .build();
    }

    public EventWithRelations getEventById(String id) {
        return eventRepository.findById(id)
                .map(DtoMappers::toEventWithRelations)
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));
    }

    public EventWithRelations addUserToAllowList(String eventId, String identifier) {

        EventEntry event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event " + eventId + " not found"));

        // 1. Resolve the user by id first, then email
        UserEntry user = userRepository.findById(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new NotFoundException("User " + identifier + " not found"));

        // 2. Skip if already present
        boolean already = event.getAllowUsers().stream()
                .anyMatch(u -> u.getId().equals(user.getId()));
        if (already) throw new ConflictException("User already allowed");

        // 3. Add DBRef
        event.getAllowUsers().add(user);
        eventRepository.save(event);

        return DtoMappers.toEventWithRelations(event);
    }

    @Transactional   // atomic: all or nothing
    public BulkAllowResponse bulkAddAllowUsers(String eventId, List<String> emails) {
        try{

            EventEntry event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new NotFoundException("Event " + eventId + " not found"));

            // normalise & deduplicate client input
            Set<String> targets = emails.stream()
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            // fetch all users in one query
            List<UserEntry> users = userRepository.findAllByEmailIn(targets);

            // index by email for quick lookup
            Map<String, UserEntry> emailToUser = users.stream()
                    .collect(Collectors.toMap(u -> u.getEmail().toLowerCase(), u -> u));

            List<String> added   = new ArrayList<>();
            List<String> skipped = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            for (String email : targets) {
                UserEntry u = emailToUser.get(email);
                if (u == null) {
                    missing.add(email);
                    continue;
                }
                boolean already = event.getAllowUsers().stream()
                        .anyMatch(x -> x.getId().equals(u.getId()));
                if (already) {
                    skipped.add(email);
                } else {
                    event.getAllowUsers().add(u);   // DBRef
                    added.add(email);
                }
            }

            eventRepository.save(event);   // single write

            return new BulkAllowResponse(
                    added, skipped, missing,
                    DtoMappers.toEventWithRelations(event));
        } catch (Exception e) {
            throw new RuntimeException("Bulk allow failed: " + e.getMessage(), e);
     }
    }
}

