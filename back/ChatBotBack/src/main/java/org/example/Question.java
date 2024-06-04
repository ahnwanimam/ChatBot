package org.example;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class Question {
    private int id;
    private String con;
    private int category;

    @Builder
    public Question(String con, int category) {
        this.con = con;
        this.category = category;
    }
}
