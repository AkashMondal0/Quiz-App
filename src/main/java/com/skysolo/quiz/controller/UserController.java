package com.skysolo.quiz.controller;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("users")
public class UserController {

    @GetMapping
    public String getUsers() {

        return "List of users";
    }
}
