import styles from './ChatBot.module.css';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

export default function ChatBot( ) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const inputRef = useRef(0);

  function handleInputChange () {
    setInput(inputRef.current.value);
  };

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

        // 챗봇 메시지를 추가
        const botNewMessage = `챗봇: ${botMessage}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botNewMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // 비슷한 질문 확인 후 사용자 응답을 기다림
        if (data.answer.includes("혹시")) {
          setTimeout(() => handleUserResponse("response"), 2);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        const errorMessage = `챗봇: 답변을 할 수 없는 오류가 생겼습니다.`;
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

        // 챗봇의 응답 추가
        const botNewMessage = `챗봇: ${botMessage}`;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botNewMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);

        // 추가 질문 확인
        if (data.answer.includes("그렇다면")) {
          setTimeout(() => handleUserResponse("secResponse"), 2);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        const errorMessage = `챗봇: 답변을 할 수 없는 오류가 생겼습니다.`;
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

  function popUp () {
    const url = "Question"
    window.open(url, "_blank", "width=400, height=400, top=150, left=500");
  }

  function removeMessage () {
    setMessages([]);
  }

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }


    return (
        <div>
          <div className={styles.logo}>
            <Typography variant="h2" gutterBottom>
              <Link to={"/"}><HomeIcon sx={{ fontSize: 60 }} /></Link>서경챗봇
            </Typography>
          </div>
          <div className={styles.headBtn}>
            <Link to={"/Login" }>
              <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}}>로그인</Button>
            </Link>
            <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={removeMessage}>지우기</Button>
          </div>
          <div className={styles.wrap}>
            <div className={styles.left}></div>
            <div className={styles.mid}>
            <div className={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.text.startsWith("나:") ? styles.user : styles.bot}>
                      <div className={msg.text.startsWith("나:") ? styles.userIcon : styles.botIcon}></div>
                      <div>
                        {msg.text.startsWith("나:") ? msg.text.replace("나:", "") : msg.text.replace("챗봇:", "")}
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