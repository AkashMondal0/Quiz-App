package com.skysolo.quiz.entry;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@Document("users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntry implements UserDetails {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String name;
    private String url;

    @Indexed(unique = true)
    private String email;
    private String password;
    private boolean enabled = true;

    // Optional account status fields
    private boolean accountNonExpired = true;
    private boolean accountNonLocked = true;
    private boolean credentialsNonExpired = true;

    private ArrayList<String> roles = new ArrayList<>(); // e.g., ["ROLE_USER", "ROLE_ADMIN"]

    // UserDetails interface methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles
                .stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}
