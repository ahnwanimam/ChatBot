import styles from './LoginChatBot.module.css';
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const saveMessages = messages.filter((msg) => msg.startsWith("나:"));
  const saveMessagesBot = messages.filter((msg) => msg.startsWith("챗봇:"));

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
  }, [Mem]);

  const inputRef = useRef(null);

  function handleInputChange() {
    setInput(inputRef.current.value);
  }

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      // 사용자 메시지를 추가
      setMessages((prevMessages) => [...prevMessages, `나: ${input}`]);

      // FastAPI 서버에 요청 보내기
      try {
        const response = await fetch(`http://localhost:8000/model?question=${input}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const botMessage = data.answer ? data.answer : '질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다.';
        // 챗봇 메시지 추가
        setMessages((prevMessages) => [...prevMessages, `챗봇: ${botMessage}`]);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setMessages((prevMessages) => [...prevMessages, '챗봇: Error fetching data']);
      }

      // 입력 필드 초기화
      inputRef.current.value = '';
      setInput('');
    }
  };

  function popUp() {
    const url = "Question";
    window.open(url, "_blank", "width=400, height=400, top=150, left=500");
  }

  function removeMessage() {
    setMessages([]);
  }

  function saveMessage(event) {
    event.preventDefault();

    const bodyString = JSON.stringify({
      "mem_id": Mem.mem_id,
      "title": saveMessages.length > 0 ? saveMessages[0].replace('나: ', '') : 'Untitled',
      "con": saveMessages.join('\t'),
      "conBot": saveMessagesBot.join('\t')
    });

    fetch(`/chatlogs`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: bodyString
    }).then(res => {
      console.log(res);
      if (res.ok) {
        console.log(res);
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
        <h1 className={styles.logo}>서경챗봇</h1>
        <div class={styles.Mem}>
          <h4>안녕하세요, {Mem.mem_nm}님!</h4>
        </div>
        <div className={styles.headBtn}>
          <button onClick={logout} class={styles.logoutBtn}>로그아웃</button>
          <button className={styles.button} id={styles.saveBtn} onClick={saveMessage}>저장</button>
          <button className={styles.button} id={styles.removeBtn} onClick={removeMessage}>지우기</button>
        </div>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <table>
              <tbody>
              {chatlogs.map((chatlog) => (
                  <tr key={chatlog.id}>
                    <button onClick={() => window.open("ChatLog/" + (chatlog.id), "_blank", "width=400, height=400, top=150, left=500")}>{chatlog.id}. {chatlog.title}</button>
                    <br></br>
                    <br></br>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className={styles.mid}>
            <div className={styles.messages}>
              {messages.map((msg, index) => (
                  <div key={index} class={msg.startsWith("나:") ? styles.user : styles.bot}>
                    {msg}
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
          <button className={styles.button} onClick={handleSendMessage}>전송</button>
          <div className={styles.question}>
            <button onClick={popUp} className={styles.button}>질문 요청</button>
          </div>
        </div>
      </div>
  );
}