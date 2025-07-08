package com.skysolo.quiz.payload.respose;

import java.io.Serializable;
import java.util.List;

public class SessionResponse implements Serializable {
    private String id;
    private String email;
    private List<String> roles;
    private String name;
    private String username;

    public SessionResponse() {}

    public SessionResponse(
            String id,
            String email, List<String> roles ,
            String name, String username) {
        this.id = id;
        this.email = email;
        this.roles = roles;
        this.name = name;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public List<String> getRoles() {
        return roles;
    }
    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
}


