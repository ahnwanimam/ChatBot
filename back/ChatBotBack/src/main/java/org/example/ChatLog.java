package org.example;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ChatLog {
    private int id;
    private String mem_id;
    private String title;
    private String con;
    private LocalDateTime reg_dtm;


    @Builder
    ChatLog(int id, String mem_id, String title, String con, LocalDateTime reg_dtm) {
        this.id = id;
        this.mem_id = mem_id;
        this.title = title;
        this.con = con;
        this.reg_dtm = reg_dtm;
    }
}