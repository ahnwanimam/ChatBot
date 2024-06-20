package org.example;

import lombok.Getter;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public class ChatLogDto {
    private int id;
    private String mem_id;
    private String title;
    private String con;
    private String conBot;
    private int isDeleted;
    private LocalDate reg_dtm;

    public ChatLogDto(ChatLog chatLog) {
        this.id = chatLog.getId();
        this.mem_id = chatLog.getMem_id();
        this.title = chatLog.getTitle();
        this.con = chatLog.getCon();
        this.conBot = chatLog.getConBot();
        this.isDeleted = chatLog.getIsDeleted();
        this.reg_dtm = chatLog.getReg_dtm();
    }
}
