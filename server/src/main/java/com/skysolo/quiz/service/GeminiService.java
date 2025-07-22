package com.skysolo.quiz.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skysolo.quiz.config.value.GenAiConfig;
import com.skysolo.quiz.entry.QuestionEntry;
import com.skysolo.quiz.exception.BadRequestException;
import com.skysolo.quiz.payload.quiz.GenerateQuizRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private GenAiConfig genAiConfig;

    public List<QuestionEntry> generateQuizQuestions(GenerateQuizRequest request) {
        Map<String, Object> part = getPromptPayload(request);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));

        String GEMINI_URL = genAiConfig.getModelUrl() + genAiConfig.getApiKey();
        try {
        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", Collections.singletonList(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", genAiConfig.getApiKey()); // Optional, already in URL

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_URL, HttpMethod.POST, entity, Map.class);

            // Parse the response structure
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) contentMap.get("parts");

            String jsonText = parts.get(0).get("text").trim();

            // Remove any unwanted wrapping artifacts (if any)
            jsonText = jsonText.replaceAll("(?s)```(?:json)?|```", "").trim();

            // Parse the JSON into Java objects
            ObjectMapper mapper = new ObjectMapper();
            return Arrays.asList(mapper.readValue(jsonText, QuestionEntry[].class));

        } catch (Exception e) {
            throw new BadRequestException("Failed to generate Gemini response: " + e.getMessage());
        }
    }

    private Map<String, Object> getPromptPayload(GenerateQuizRequest request) {
        String topic = request.getTopic();
        int numberOfQuestions = request.getNumberOfQuestions();
        String difficulty = request.getDifficulty();

        String prompt = String.format(
                "You are a JSON API. Generate exactly %d multiple-choice questions on the topic \"%s\" with \"%s\" difficulty.\n" +
                        "Respond only with a pure JSON array (no markdown, no explanation, no formatting), like:\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"text\": \"What is JavaScript primarily used for?\",\n" +
                        "    \"options\": [\n" +
                        "      \"Server-side scripting\",\n" +
                        "      \"Database management\",\n" +
                        "      \"Client-side web development\",\n" +
                        "      \"Mobile app development\"\n" +
                        "    ],\n" +
                        "    \"correctIndex\": 2\n" +
                        "  }\n" +
                        "]\n\n" +
                        "Requirements:\n" +
                        "- Output ONLY a valid JSON array\n" +
                        "- Each object must contain: \"text\", \"options\", and \"correctIndex\"\n" +
                        "- \"options\" must always contain exactly 4 strings\n" +
                        "- \"correctIndex\" must be a number from 0 to 3\n" +
                        "- All question texts and options must have proper spacing and be human-readable\n" +
                        "- Do NOT include any markdown (like ```), explanation, or non-JSON text",
                numberOfQuestions, topic, difficulty
        );

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        return part;
    }
}
