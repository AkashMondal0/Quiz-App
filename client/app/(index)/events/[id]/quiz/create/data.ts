import { Quiz } from "@/types/QuizTypes";

export const exampleQuiz: Quiz = {
    "id": "68810ce655ebc9e9013ab83c",
    "eventId": "687d08f3f1fd8757fa974810",
    "title": "Java Basics Quiz",
    "description": "A quiz on Java fundamentals",
    "createdAt": "2025-07-23T16:25:10.403308900Z",
    "durationLimitSeconds": 900,
    "participantLimitEnabled": true,
    "participantLimit": 100,
    "sendEmailFeatureEnabled": false,
    "attemptCount": 0,
    "participantsCount": 0,
    "questions": [
    {
        "text": "What is JavaScript primarily used for?",
        "options": [
            "Server-side scripting",
            "Database management",
            "Client-side web development",
            "Operating system development"
        ],
        "correctIndex": 2
    },
    {
        "text": "Which keyword is used to declare a variable in JavaScript?",
        "options": [
            "var",
            "string",
            "vbl",
            "lettr"
        ],
        "correctIndex": 0
    },
    {
        "text": "How do you write 'Hello World' in an alert box?",
        "options": [
            "msgBox('Hello World');",
            "alertBox('Hello World');",
            "alert('Hello World');",
            "msg('Hello World');"
        ],
        "correctIndex": 2
    },
    {
        "text": "Where is the correct place to insert a JavaScript?",
        "options": [
            "The <head> section",
            "The <body> section",
            "Both the <head> section and the <body> section are correct",
            "The <footer> section"
        ],
        "correctIndex": 2
    },
    {
        "text": "How do you create a function in JavaScript?",
        "options": [
            "function myFunction()",
            "function:myFunction()",
            "function = myFunction()",
            "function => myFunction()"
        ],
        "correctIndex": 0
    },
    {
        "text": "How do you call a function named 'myFunction'?",
        "options": [
            "call myFunction()",
            "myFunction()",
            "execute myFunction()",
            "run myFunction()"
        ],
        "correctIndex": 1
    },
    {
        "text": "How do you write an IF statement in JavaScript?",
        "options": [
            "if i = 5 then",
            "if (i == 5)",
            "if i == 5",
            "if i = 5"
        ],
        "correctIndex": 1
    },
    {
        "text": "How does a FOR loop start?",
        "options": [
            "for (i = 0; i <= 5)",
            "for (i = 0; i <= 5; i++)",
            "for i = 1 to 5",
            "for (i <= 5; i++)"
        ],
        "correctIndex": 1
    },
    {
        "text": "How can you add a comment in JavaScript?",
        "options": [
            "'This is a comment",
            "<!-- This is a comment -->",
            "// This is a comment",
            "* This is a comment *"
        ],
        "correctIndex": 2
    },
    {
        "text": "What is the correct way to write an array in JavaScript?",
        "options": [
            "var colors = 'red', 'green', 'blue'",
            "var colors = (1:'red', 2:'green', 3:'blue')",
            "var colors = ['red', 'green', 'blue']",
            "var colors = {red, green, blue}"
        ],
        "correctIndex": 2
    }
],
    "user": {
        "id": "6870c9034a0cd194698675bc",
        "username": "admin",
        "name": "adminxx",
        "url": "https://google.com",
        "email": "oli@example.com",
        "password": "$2a$10$vwNM64Gi0/hXhbrVFStcFugOKJQI65czTdWHLQk40jlyM2Kz0DDom",
        "enabled": true,
        "accountNonExpired": true,
        "accountNonLocked": true,
        "credentialsNonExpired": true,
        "roles": [
            "ROLE_USER"
        ],
        "authorities": [
            {
                "authority": "ROLE_USER"
            }
        ]
    },
    "allowUsers": [],
    "participants": [],
    "attempts": [],
    "public": true,
    "durationEnabled": true
}