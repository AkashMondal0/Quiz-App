package com.skysolo.quiz.entry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationEntry {
    @Id
    private String id;
    private String name;
}
