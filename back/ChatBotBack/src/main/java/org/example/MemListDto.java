package org.example;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MemListDto {
    private String memId;
    private String memPw;
    private String memNm;
    private String memMail;

    public MemListDto(Mem mem) {
        this.memId = mem.getMem_id();
        this.memPw = mem.getMem_pw();
        this.memNm = mem.getMem_nm();
        this.memMail = mem.getMem_mail();
    }
}
