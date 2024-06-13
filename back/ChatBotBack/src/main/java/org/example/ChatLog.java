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
<<<<<<< HEAD
=======
    private String conBot;
>>>>>>> Deokhwan
    private LocalDateTime reg_dtm;


    @Builder
<<<<<<< HEAD
    ChatLog(int id, String mem_id, String title, String con, LocalDateTime reg_dtm) {
=======
    ChatLog(int id, String mem_id, String title, String con, String conBot, LocalDateTime reg_dtm) {
>>>>>>> Deokhwan
        this.id = id;
        this.mem_id = mem_id;
        this.title = title;
        this.con = con;
<<<<<<< HEAD
=======
        this.conBot = conBot;
>>>>>>> Deokhwan
        this.reg_dtm = reg_dtm;
    }
}