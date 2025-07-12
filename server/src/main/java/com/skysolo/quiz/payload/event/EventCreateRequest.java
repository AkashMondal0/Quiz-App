package com.skysolo.quiz.payload.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventCreateRequest {

    @NotBlank
    private String tag;

    @NotBlank
    private String organizationId;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Builder.Default
    private String startDate = LocalDate.now().toString();   // ISO‑8601 string

    @NotNull
    @Builder.Default
    private String endDate = LocalDate.now().plusDays(1).toString();   // ISO‑8601 string

    /** optional switches **/
    @Builder.Default
    private boolean sendEmailFeatureEnabled = false;

    @Builder.Default
    private boolean isPublic = false;
}
