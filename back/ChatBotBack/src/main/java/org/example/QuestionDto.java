package org.example;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionDto {
    private int id;
    private String con;
    private int category;

    public Question toEntity() {
        return Question.builder()
                .con(con)
                .category(category)
                .build();
    }

}
