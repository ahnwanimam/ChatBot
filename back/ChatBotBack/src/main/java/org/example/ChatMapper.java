package org.example;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.ArrayList;

@Mapper
public interface ChatMapper {
    @Select("select * from Mem where mem_id =#{mem_id} ")
    Mem findById(String id);

    @Select("select * from  Mem")
    ArrayList<Mem> findAllMem();

    @Insert("insert into mem (mem_id,mem_nm,mem_mail ,mem_pw ) values(#{mem_id},#{mem_nm},#{mem_mail},#{mem_pw})")
    int addMem(Mem mem);

    @Select("select  * from question")
    ArrayList<Question> findAllQuestion();

    @Insert("insert into question (con, category) values (#{con}, #{category})")
    int addQuestion(Question question);

}