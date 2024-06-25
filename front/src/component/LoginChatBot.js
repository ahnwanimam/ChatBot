import styles from './LoginChatBot.module.css';
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [chatlogs, setChatlogs] = useState([]);
  const [Mem, setMem] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/member`)
        .then(res => res.json())
        .then(data => { console.log(data); setMem(data); });
  }, []);

  useEffect(() => {
    if (Mem.mem_id) {
      fetch(`/chatlogs/${Mem.mem_id}`)
          .then(res => res.json())
          .then(data => { console.log(data); setChatlogs(data); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, );

  const inputRef = useRef(null);

  function handleInputChange() {
    setInput(inputRef.current.value);
  }

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = `나: ${input}`;

      // 사용자 메시지를 추가
      setMessages((prevMessages) => [ ...prevMessages, { text: newMessage, timestamp: currentTime }  ]);

      // FastAPI 서버에 요청 보내기
      try {
        const data = await fetchResponse(`http://localhost:8000/model?question=${encodeURIComponent(input)}`);
        const botMessage = data.answer ? data.answer : '질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다.';

        // 서경챗봇 메시지를 추가
        const botNewMessage = `서경챗봇: ${botMessage}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botNewMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // 비슷한 질문 확인 후 사용자 응답을 기다림
        if (data.answer.includes("혹시")) {
          setTimeout(() => handleUserResponse("response"), 3);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        const errorMessage = `서경챗봇: 답변을 할 수 없는 오류가 생겼습니다.`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: errorMessage, timestamp: currentTime }
        ]);
      }

      // 입력 필드 초기화
      inputRef.current.value = '';
      setInput('');
    }
  };

  const handleUserResponse = async (endpoint) => {
    const userResponse = prompt("예 또는 아니오로 응답해주세요.");

    if (userResponse) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = `나: ${userResponse}`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, timestamp: currentTime }
      ]);

      try {
        const data = await fetchResponse(`http://localhost:8000/${endpoint}?user_response=${encodeURIComponent(userResponse)}`);
        const botMessage = data.answer ? data.answer : '질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다.';

        // 서경챗봇의 응답 추가
        const botNewMessage = `서경챗봇: ${botMessage}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botNewMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // 추가 질문 확인
        if (data.answer.includes("그렇다면")) {
          setTimeout(() => handleUserResponse("secResponse"), 3);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        const errorMessage = `서경챗봇: 답변을 할 수 없는 오류가 생겼습니다.`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: errorMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      }
    }
  };

  const fetchResponse = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  };
  function popUp() {
    const url = "Question";
    window.open(url, "_blank", "width=600, height=400, top=200, left=450");
  }

  function removeMessage() {
    setMessages([]);
  }

  function saveMessage(event) {
    event.preventDefault();

    // 메시지 배열이 비어 있는지 확인
    if (messages.length === 0) {
      alert('저장할 대화가 없습니다.');
      return;
    }

    let title;
    const firstMessage = messages[0].text.replace(/^나: /, '');
    if (firstMessage.length > 30) {
      title = firstMessage.substring(0, 30);
    } else {
      title = firstMessage;
    }

    const bodyString = JSON.stringify({
      "mem_id": Mem.mem_id,
      "title": title,
      "con": messages.filter(msg => msg.text.startsWith("나:")).map(msg => `${msg.text} (${msg.timestamp})`).join('\t'),
      "conBot": messages.filter(msg => msg.text.startsWith("서경챗봇:")).map(msg => `${msg.text} (${msg.timestamp})`).join('\t')
    });

    fetch(`/chatlogs`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: bodyString
    }).then(res => {
      if (res.ok) {
        alert("대화를 저장하였습니다.");
        setMessages([]);
        fetch(`/chatlogs/${Mem.mem_id}`)
            .then(res => res.json())
            .then(data => { console.log(data); setChatlogs(data); });
      } else {
        alert('저장 실패');
      }
    }).catch(() => {
      console.log('error');
    });
  }

  function logout () {
    fetch(`/logout`)
    .then( res => {
        if (res.ok) {
            alert("로그아웃 되었습니다.");
            navigate("/");
        }
    }
)
}


  return (
      <div className={styles.body}>
          <div className={styles.logo}>
          </div>
        <div style={{marginTop: '8px'}}>
          <div className={styles.Mem}>
            <Typography variant="h6" gutterBottom>
              안녕하세요, {Mem.mem_nm}님!
              <button onClick={logout} className={styles.logoutBtn}>[로그아웃]</button>
            </Typography>
          </div>
          <div className={styles.headBtn}>
            <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green', marginLeft: '20px'}}
                    onClick={saveMessage}>저장</Button>
            <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green', marginLeft: '20px'}}
                    onClick={removeMessage}>지우기</Button>
          </div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <Typography variant="h6" gutterBottom sx={{textAlign: 'center'}}>
              채팅 기록
            </Typography>
            <table>
              <tbody>
              {chatlogs.map((chatlog) => (
                  <tr key={chatlog.id}>
                    <Button variant='text' size='large' sx={{color: 'green'}}
                            onClick={() => window.open("ChatLog/" + (chatlog.id), "_blank", "width=700, height=400, top=150, left=400")}>{chatlog.title} - {chatlog.reg_dtm}</Button>
                    <br></br>
                    <br></br>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className={styles.mid}>
            <div className={styles.messages}>
            <div className={styles.botHello}>
                <div className={styles.botIcon}></div>
                  저는 서경챗봇입니다. 
                  <br></br>
                  <br></br>
                  제가 제공하는 내용은 
                  <br></br>
                  1. 학교 시설의 위치 및 이동경로
                  <br></br>
                  <br></br> 
                  2. 동아리 종류 
                  <br></br>
                  <br></br>
                  3. 학과별 졸업요건 및 취업 진로 방향 
                  <br></br>입니다. 
                  <br></br>
                  <br></br>궁금한 내용이 있다면 물어보세요!
              </div>
                {messages && messages.map((msg, index) => (
                    <div key={index} className={msg.text.startsWith("나:") ? styles.user : styles.bot}>
                      <div className={msg.text.startsWith("나:") ? styles.userIcon : styles.botIcon}></div>
                      <div>
                        {msg.text.startsWith("나:") ? msg.text.replace("나:", "") : msg.text.replace("서경챗봇:", "")}
                        <div className={styles.timestamp}>{msg.timestamp}</div>
                      </div>
                    </div>
                ))}
            </div>
          </div>
          <div className={styles.right}></div>
        </div>
        <div className={styles.inputContainer}>
          <input
              type="text"
              ref={inputRef}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="내용을 입력하세요."
          />
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={handleSendMessage}>전송</Button>
          <div className={styles.question}>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={popUp}>질문요청</Button>
          </div>
        </div>
      </div>
  );
}