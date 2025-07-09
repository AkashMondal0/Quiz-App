package com.skysolo.quiz.payload.respose;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponse {
    private String id;
    private String organizationId;
    private String createdBy;
    private String title;
    private String description;
    private String accessType;
    private List<String> allowedEmails;
    private Date startAt;
    private Date endAt;
    private Date createdAt;
}
