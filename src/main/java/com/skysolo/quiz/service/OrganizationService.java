package com.skysolo.quiz.service;

import com.skysolo.quiz.entry.OrganizationEntry;
import com.skysolo.quiz.payload.request.OrganizationCreateRequest;
import com.skysolo.quiz.payload.respose.OrganizationResponse;
import com.skysolo.quiz.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final AuthService authService;

    public ResponseEntity<OrganizationResponse> createOrganization(OrganizationCreateRequest request) {
        try {
            if (organizationRepository.existsByName(request.getName())) {
                log.error("Organization with name {} already exists", request.getName());
                throw new RuntimeException("Organization with that name already exists.");
            }

            String uid = authService.getSession().getBody().getId();

            if (uid == null || uid.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(null);
            }

            OrganizationEntry org = new OrganizationEntry();
            org.setName(request.getName());
            org.setOwnerId(uid);
            org.setCreatedAt(new Date());

            OrganizationEntry savedOrg = organizationRepository.save(org);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    new OrganizationResponse(
                            savedOrg.getId(),
                            savedOrg.getName(),
                            savedOrg.getOwnerId(),
                            savedOrg.getCreatedAt())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    public ResponseEntity<List<OrganizationResponse>> getOrganizationsByOwner() {
        try {
            String uid = authService.getSession().getBody().getId();

            if (uid == null || uid.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(null);
            }

            List<OrganizationEntry> organizations = organizationRepository.findByOwnerId(uid);

            if (organizations.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            }

            List<OrganizationResponse> responseList = organizations.stream()
                    .map(org -> new OrganizationResponse(
                            org.getId(),
                            org.getName(),
                            org.getOwnerId(),
                            org.getCreatedAt()))
                    .toList();

            return ResponseEntity.ok(responseList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}

