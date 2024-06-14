import styles from './LoginChatBot.module.css';
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const [chatlogs, setChatlogs] = useState([]);
  const [Mem, setMem] = useState([]);

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
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = `나: ${input}`;

      // 사용자 메시지를 추가
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, timestamp: currentTime }]);

      // FastAPI 서버에 요청 보내기
      try {
        const response = await fetch(`http://localhost:8000/model?question=${input}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const botMessage = data.answer ? data.answer : '질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다.';

        // 챗봇 메시지를 추가
        const botNewMessage = `챗봇: ${botMessage}`;
        setMessages((prevMessages) => [...prevMessages, { text: botNewMessage, timestamp: currentTime }]);
      } catch (error) {
        console.error("Error fetching data: ", error);
        const errorMessage = `챗봇: Error fetching data`;
        setMessages((prevMessages) => [...prevMessages, { text: errorMessage, timestamp: currentTime }]);
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

  function deleteChatlog(id) {
    fetch(`/chatlogs/${id}`, {
      method: 'DELETE'
    })
        .then(response => {
          if (response.ok) {
            setChatlogs(prevChatlogs => prevChatlogs.filter(chatlog => chatlog.id !== id));
            console.log(`해당 채팅 이력이 삭제되었습니다.`);
          } else {
            console.error(`해당 채팅 이력이 삭제되지 않았습니다.`);
          }
        })
        .catch(error => {
          console.error('Error deleting chatlog:', error);
        });
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
      "conBot": messages.filter(msg => msg.text.startsWith("챗봇:")).map(msg => `${msg.text} (${msg.timestamp})`).join('\t')
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

  return (
      <div className={styles.body}>
        <Link to={"/LoginMain"}><h1 className={styles.logo}>서경챗봇</h1></Link>
        <div className={styles.headBtn}>
          <button className={styles.button} id={styles.saveBtn} onClick={saveMessage}>저장</button>
          <button className={styles.button} id={styles.removeBtn} onClick={removeMessage}>지우기</button>
        </div>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <table>
              <tbody>
              {chatlogs.map(chatlog => (
                  <tr key={chatlog.id}>
                    <td>
                      <button onClick={() => window.open(`ChatLog/${chatlog.id}`, "_blank", "width=400, height=400, top=150, left=500")}>{chatlog.title}</button>
                    </td>
                    <td>
                      <button onClick={() => deleteChatlog(chatlog.id)}>X</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className={styles.mid}>
            <div>
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
