package com.skysolo.quiz.entry;

import com.skysolo.quiz.payload.auth.UserSummary;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "organization_members")
@CompoundIndexes({
        @CompoundIndex(name = "org_user_idx", def = "{'organization': 1, 'user': 1}", unique = true)
})
@Data
public class OrganizationMemberEntry {
    @Id
    private String id;

    @DBRef
    private OrganizationEntry organization;

    @DBRef
    private UserSummary user;

    private String role; // 'admin', 'moderator', 'participant', 'viewer'

    private String status; // 'active', 'pending', 'banned'

    private Date joinedAt = new Date();
}
