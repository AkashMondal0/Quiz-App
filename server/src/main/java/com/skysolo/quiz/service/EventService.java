package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.EventEntry;
import com.skysolo.quiz.entry.UserEntry;
import com.skysolo.quiz.exception.BadRequestException;
import com.skysolo.quiz.exception.NotFoundException;
import com.skysolo.quiz.payload.auth.UserSummary;
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

    private String getUserId() {
        String userId = authService.getSession().getBody().getId();

        if (userId == null || userId.isEmpty()) {
            throw new NotFoundException("User not found");
        }

        return userId;
    }

    // create an event
    public EventResponse create(EventCreateRequest req) {
        try{
            String userId = getUserId();
            UserEntry creator = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));

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
        } catch (Exception e) {
            throw new BadRequestException("Event creation failed: " + e.getMessage());
        }
    }

    // get all events
    public EventWithRelations getEventById(String id) {
        try {
            return eventRepository.findById(id)
                    .map(DtoMappers::toEventWithRelations)
                    .orElseThrow(() -> new NotFoundException("Event not found with id: " + id));
        } catch (Exception e) {
            throw new NotFoundException("Event not found: " + e.getMessage());
        }
    }

    // add user to allow list
    @Transactional
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
            throw new BadRequestException("Bulk allow failed: " + e.getMessage());
      }
    }

    // remove user from allow list
    @Transactional
    public BulkRemoveResponse bulkRemoveAllowUsers(String eventId, List<String> emails) {

        EventEntry event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Event " + eventId + " not found"));

        Set<String> normalizedEmails = emails.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<UserEntry> foundUsers = userRepository.findAllByEmailIn(normalizedEmails);

        Map<String, UserEntry> emailToUser = foundUsers.stream()
                .collect(Collectors.toMap(
                        u -> u.getEmail().toLowerCase(),
                        u -> u
                ));

        List<String> removed = new ArrayList<>();
        List<String> notInList = new ArrayList<>();
        List<String> notFound = new ArrayList<>();

        for (String email : normalizedEmails) {
            UserEntry user = emailToUser.get(email);

            if (user == null) {
                notFound.add(email);
                continue;
            }

            boolean wasInList = event.getAllowUsers().removeIf(u -> u.getId().equals(user.getId()));

            if (wasInList) {
                removed.add(email);
            } else {
                notInList.add(email);
            }
        }

        eventRepository.save(event);

        return new BulkRemoveResponse(
                removed,
                notFound,
                notInList,
                DtoMappers.toEventWithRelations(event)
        );
    }

    // get events by author
    public List<EventMapper.EventSummary> getEventsByAuthor(
            // params limit, offset, sortBy, sortOrder
//            @RequestParam(required = false) Integer limit,
//            @RequestParam(required = false) Integer offset,
//            @RequestParam(required = false) String sortBy,
//            @RequestParam(required = false) String sortOrder
    ) {
        String userId = getUserId();
        if (userId == null || userId.isEmpty()) {
            throw new NotFoundException("User not found");
        }
        List<EventEntry> events = eventRepository.findByUserId(userId);

        return events.stream()
                .map(EventMapper::toEventSummary)
                .collect(Collectors.toList());
    }
}

