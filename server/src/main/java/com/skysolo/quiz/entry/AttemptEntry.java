package com.skysolo.quiz.entry;

import com.skysolo.quiz.entry.UserEntry;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptEntry {
    @DBRef
    private UserEntry user;

    private String startedAt;
    private String endedAt;

    @Builder.Default
    private List<Integer> selectedOptions = new ArrayList<>(); // Optional
}
