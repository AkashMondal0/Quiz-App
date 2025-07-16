package com.skysolo.quiz.config;
import com.skysolo.quiz.entry.ConfigEntry;
import com.skysolo.quiz.repository.ConfigRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class CacheConfig {
    @Autowired
    private ConfigRepository configRepository;

    public Map<String, String> cacheKeys = new HashMap<>();

    @PostConstruct
    public void init(){
        List<ConfigEntry> all = configRepository.findAll();

        for (ConfigEntry configEntry:all){
            cacheKeys.put(configEntry.getKey(),configEntry.getValue());
        }
    }
}
