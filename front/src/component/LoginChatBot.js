import styles from './ChatBot.module.css';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ChatBot( ) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const inputRef = useRef(0);

  function handleInputChange () {
    setInput(inputRef.current.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, "\n나: " + input]);
      inputRef.current.value = null;
    }
  };

  function popUp () {
    const url = "Question"

    window.open(url, "_blank", "width=400, height=400, top=150, left=500");
  }

    return ( 
    <body className={styles.body}>
      <Link to={"/"}><h1 className={styles.logo}>서경챗봇</h1></Link>
      <div className={styles.wrap}>
        <div className={styles.left}>
        </div>
        <div className={styles.mid}>
          <div className="messages">
            {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
            ))}
          </div>
        </div>
      <div className={styles.right}>
      </div>
    </div>
    <div className="input-container">
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
  </body>
    );
}