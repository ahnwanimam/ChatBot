package org.example;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ChatLogAddDto {
    private int id;
    private String mem_id;
    private String title;
    private String con;
    private String conBot;
    private LocalDateTime reg_dtm;

    public ChatLog toEntity() {
        return ChatLog.builder()
                .mem_id(mem_id)
                .title(title)
                .con(con)
                .conBot(conBot)
                .build();
    }

}
