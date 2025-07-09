package com.skysolo.quiz.entry;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventCreateRequest {
    @NotBlank
    private String organizationId;

    @NotBlank
    private String title;

    private String description;

    private String accessType; // "public" or "private"

    private List<String> allowedEmails;

    private Date startAt;

    private Date endAt;
}
