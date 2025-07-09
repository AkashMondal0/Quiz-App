package com.skysolo.quiz.payload.respose;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class OrganizationResponse {
    private String id;
    private String name;
    private String ownerId;
    private Date createdAt;
}