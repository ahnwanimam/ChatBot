package org.example;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(originPatterns = "*")
public class ChatController {

    @Autowired
    ChatService chatService;
    @Autowired
    private DataSourceTransactionManagerAutoConfiguration dataSourceTransactionManagerAutoConfiguration;

    @PostMapping("/login")
    String login(@RequestBody MemDto memDto, HttpSession session) {
        Mem loginMem = chatService.login(memDto);   //입력한 id와 비밀번호를 가진 멤버를 가져온다.
        if (loginMem != null) { //멤버가 null이 아니면(해당 멤버가 있는 멤버라면)
            session.setAttribute("loginuser", loginMem);    //로그인을 위해 해당 멤버 정보를 세션에 저장한다.
            System.out.println(session.getAttribute("loginuser"));
            return "로그인 성공!";
        } else return "로그인 실패"; //해당 멤버는 없는 멤버이므로 로그인에 실패.
    }

    //세션에 저장된 정보를 가져와 현재 로그인한 멤버 확인.
    @GetMapping("/member")
    Mem member(Mem mem, HttpSession session) {
        System.out.println(session.getAttribute("loginuser"));
        Mem loginMem = (Mem) session.getAttribute("loginuser");
        return loginMem;
    }

    //세션을 제거하며 로그아웃.
    @GetMapping("/logout")
    String login(HttpSession session) {
        session.removeAttribute("loginuser");
        System.out.println(session.getAttribute("loginuser"));
        return "로그아웃";
    }


    //전체 멤버(회원) 목록.
    @GetMapping("/members")
    ArrayList<Mem> findAllMem() {
        return chatService.findAllMem();
    }


    //멤버 등록 (회원가입)
    @PostMapping("/members")
    public ResponseEntity addMem(@RequestBody MemAddDto request) {
        int add = chatService.addMem(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(add);
    }

    //질문요청 목록.
    @GetMapping("/questions")
    ArrayList<Question> findAllQuestion() {
        return chatService.findAllQuestion();
    }

    //질문요청 등록
    @PostMapping("/questions")
    public ResponseEntity addQuestion(@RequestBody QuestionAddDto request) {
        int add = chatService.addQuestion(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(add);
    }

    //채팅이력 목록.
    @GetMapping("/chatlogs")
    ArrayList<ChatLog> findAllChatLog() {
        return chatService.findAllChatLog();
    }

    //해당 회원의 채팅이력 목록.
    @GetMapping("/chatlogs/{mem_id}")
    ArrayList<ChatLog> findChatLogBymemId(@PathVariable String mem_id) {

        return chatService.findChatLogByMemId(mem_id);
    }

    //채팅이력 저장
    @PostMapping("/chatlogs")
    public ResponseEntity addChatLog(@RequestBody ChatLogAddDto request) {
        int add = chatService.addChatLog(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(add);
    }

    //특정 채팅이력 확인 (삭제를 위함)
    @GetMapping("/chatlogsid/{id}")
    ChatLog findChatLogById(@PathVariable int id) {
        return chatService.findChatLogById(id);
    }

    //채팅이력 삭제
    @PutMapping("/chatlogsid/{id}")
    public ResponseEntity updateByMemId(@PathVariable int id, @RequestBody ChatLogUpdate request) {
        int updateCnt = chatService.updateByMemId(id, request);



        return ResponseEntity.status(HttpStatus.CREATED)
                .body(updateCnt);
    }

}

