package org.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    Mem login(MemDto memDto) {
        Mem LoginMem = chatMapper.findById(memDto.getMemId());
        if(LoginMem == null) {return null;}
        if (LoginMem.getMem_pw().equals(memDto.getMemPw()))
            return LoginMem;
        else return null;
    }
    ArrayList<Mem> findAllMem() {

        return chatMapper.findAllMem();
    }

    public int addMem(MemAddDto request) {

        return chatMapper.addMem(request.toEntity());
    }

    ArrayList<Question> findAllQuestion() {

        return chatMapper.findAllQuestion();
    }

    public int addQuestion(QuestionAddDto request) {

        return chatMapper.addQuestion(request.toEntity());
    }

    ArrayList<ChatLog> findAllChatLog() {
        return chatMapper.findAllChatLog();
    }

<<<<<<< HEAD
    ChatLog findChatLogById(String mem_id) {
=======
    ArrayList<ChatLog> findChatLogByMemId(String mem_id) {
>>>>>>> Deokhwan
        return chatMapper.findByMemId(mem_id);
    }

    public int addChatLog(ChatLogAddDto request) {
        return chatMapper.addChatLog(request.toEntity());
    }

<<<<<<< HEAD
=======
    ChatLog findChatLogById(int id) {
        return chatMapper.findByChatLogId(id);
    }

>>>>>>> Deokhwan
}
