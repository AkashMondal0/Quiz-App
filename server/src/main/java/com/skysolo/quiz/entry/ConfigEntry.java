package com.skysolo.quiz.entry;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "config")
public class ConfigEntry {
    private String key;
    private  String value;
}