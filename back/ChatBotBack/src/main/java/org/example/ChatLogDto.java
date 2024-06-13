package org.example;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChatLogDto {
    private int id;
    private String mem_id;
    private String title;
    private String con;
    private String conBot;
    private LocalDateTime reg_dtm;

    public ChatLogDto(ChatLog chatLog) {
        this.id = chatLog.getId();
        this.mem_id = chatLog.getMem_id();
        this.title = chatLog.getTitle();
        this.con = chatLog.getCon();
        this.conBot = chatLog.getConBot();
        this.reg_dtm = chatLog.getReg_dtm();
    }
}
