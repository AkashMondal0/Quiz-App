package com.skysolo.quiz.controller;

import com.skysolo.quiz.payload.request.OrganizationCreateRequest;
import com.skysolo.quiz.payload.respose.OrganizationResponse;
import com.skysolo.quiz.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    public ResponseEntity<OrganizationResponse> createOrganization(@Valid @RequestBody OrganizationCreateRequest request) {
        return organizationService.createOrganization(request);
    }

    @GetMapping
    public ResponseEntity<List<OrganizationResponse>> getMyOrganizations() {
       return organizationService.getOrganizationsByOwner();
    }
}
