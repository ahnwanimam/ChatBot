package org.example;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface ChatMapper {
    //로그인을 위한 id 찾기
    @Select("select * from Mem where mem_id =#{mem_id} ")
    Mem findById(String id);

    //회원 목록
    @Select("select * from  Mem")
    ArrayList<Mem> findAllMem();

    //회원가입
    @Insert("insert into mem (mem_id,mem_nm,mem_mail ,mem_pw ) values(#{mem_id},#{mem_nm},#{mem_mail},#{mem_pw})")
    int addMem(Mem mem);

    //질문요청 목록
    @Select("select  * from question")
    ArrayList<Question> findAllQuestion();

    //질문요청 추가
    @Insert("insert into question (con, category) values (#{con}, #{category})")
    int addQuestion(Question question);

    //채팅이력 목록
    @Select("select * from chatlog")
    ArrayList<ChatLog> findAllChatLog();

    //해당 멤버에 삭제되지 않은 (isDeleted = 0인) 채팅이력만 보여준다.
    @Select("select * from chatlog where mem_id = #{mem_id} and isDeleted = 0")
    ArrayList<ChatLog> findByMemId(String mem_id);

    //채팅이력 저장
    @Insert("insert into chatlog (mem_id, title, con, conBot) values (#{mem_id}, #{title}, #{con}, #{conBot})")
    int addChatLog(ChatLog chatLog);


    @Select("select * from chatlog where id = #{id}")
    ChatLog findByChatLogId(int id);


    //수정을 통한 삭제 처리.
    @Update("update chatlog set isDeleted = 1 where id = #{id}")
    int updateByMemId(ChatLog chatLog);

}
