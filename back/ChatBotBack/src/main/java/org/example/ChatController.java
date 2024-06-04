package org.example;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@CrossOrigin(originPatterns = "*")
public class ChatController {

    @Autowired
    ChatService chatService;
    @Autowired
    private DataSourceTransactionManagerAutoConfiguration dataSourceTransactionManagerAutoConfiguration;

    @PostMapping("/login")
    String login(@RequestBody MemDto memDto, HttpSession session) {
        Mem loginMem = chatService.login(memDto);
        if (loginMem != null) {
            session.setAttribute("loginuser", loginMem);
            System.out.println(session.getAttribute("loginuser"));
            return "로그인 성공!";
        } else return "로그인 실패";
    }
    @GetMapping("/main")
    String main(Mem mem, HttpSession session) {
        System.out.println(session.getAttribute("loginuser"));
        Mem loginMem = (Mem) session.getAttribute("loginuser");
        if (loginMem != null) {
            return "Main 페이지";
        } else return "로그인을 해야 볼 수 있는 페이지입니다.";
    }
    @GetMapping("/member")
    Mem member(Mem mem, HttpSession session) {
        System.out.println(session.getAttribute("loginuser"));
        Mem loginMem = (Mem) session.getAttribute("loginuser");
        return loginMem;
    }

    @GetMapping("/logout")
    String login(HttpSession session) {
        session.removeAttribute("loginuser");
        System.out.println(session.getAttribute("loginuser"));
        return "로그아웃";
    }

    @GetMapping("/members")
    ArrayList<Mem> findAllMem() {
        return chatService.findAllMem();
    }


    @PostMapping("/members")
    public ResponseEntity addMem(@RequestBody MemAddDto request) {
        int add = chatService.addMem(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(add);
    }

    @GetMapping("/questions")
    ArrayList<Question> findAllQuestion() {
        return chatService.findAllQuestion();
    }

    @PostMapping("/questions")
    public ResponseEntity addQuestion(@RequestBody QuestionDto request) {
        int add = chatService.addQuestion(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(add);
    }

}

