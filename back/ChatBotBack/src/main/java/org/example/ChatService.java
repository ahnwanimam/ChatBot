package org.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    Mem login(MemDto memDto) {
        Mem LoginMem = chatMapper.findById(memDto.getMemId());  //입력 받은 id가 DB에 있는지 확인.
        if(LoginMem == null) {return null;}     //null(입력 받은 아이디가 DB에 없으면) null값 리턴.
        if (LoginMem.getMem_pw().equals(memDto.getMemPw()))    // 입력받은 id가 DB에 존재하고, 둘의 비밀번호까지 같으면 해당 멤버 객체 리턴.
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

    ArrayList<ChatLog> findChatLogByMemId(String mem_id) {
        return chatMapper.findByMemId(mem_id);
    }

    public int addChatLog(ChatLogAddDto request) {
        return chatMapper.addChatLog(request.toEntity());
    }

    ChatLog findChatLogById(int id) {
        return chatMapper.findByChatLogId(id);
    }

    @Transactional
    public int updateByMemId(int id, ChatLogUpdate request) {
        ChatLog chatLog = chatMapper.findByChatLogId(id); //특정 채팅이력(삭제할 채팅이력)을 가져온다.
        chatLog.setIsDeleted(request.getIsDeleted()); // isDeleted 값을 입력한 값 (1에서 0으로) 설정한다.

        int updateCnt = chatMapper.updateByMemId(chatLog);
        return updateCnt;
    }

}
