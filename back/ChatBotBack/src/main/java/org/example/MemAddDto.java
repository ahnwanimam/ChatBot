package org.example;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class MemAddDto {
    private String memId;
    private String memPw;
    private String memNm;
    private String memMail;

    public Mem toEntity() {
        return Mem.builder()
                .mem_id(memId)
                .mem_pw(memPw)
                .mem_nm(memNm)
                .mem_mail(memMail)
                .build();
    }
}
