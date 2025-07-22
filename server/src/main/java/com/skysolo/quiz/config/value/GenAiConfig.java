package com.skysolo.quiz.config.value;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "genai")
public class GenAiConfig {
    private String apiKey;
    private String modelUrl;

    public String getApiKey() {
        return apiKey;
    }
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModelUrl() {
        return modelUrl;
    }
    public void setModelUrl(String modelUrl) {
        this.modelUrl = modelUrl;
    }
}
