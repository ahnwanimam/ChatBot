package org.example;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class Mem {
    private String mem_id;
    private String mem_pw;
    private String mem_nm;
    private String mem_mail;

    @Builder
    Mem(String mem_id, String mem_pw, String mem_nm, String mem_mail) {
        this.mem_id = mem_id;
        this.mem_pw = mem_pw;
        this.mem_nm = mem_nm;
        this.mem_mail = mem_mail;
    }
}
