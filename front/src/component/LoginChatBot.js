import styles from './LoginChatBot.module.css';
import React, { useRef, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

export default function ChatBot( ) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const saveMessages = messages.toString();

  const [chatlogs, setChatlogs] = useState({
    "id" : 0,
    "mem_id" : null,
    "title" : null,
    "con" : null,
    "reg_dtm" : null
  });

  const [Mem, setMem] = useState({
    "mem_id": null,
    "mem_pw": null,
    "mem_nm": null,
    "mem_mail": null,

});

useEffect( () => {
  fetch(`/member`)
  .then( res => {return res.json() })
  .then( data => {console.log(data); setMem(data)});
}, []);

  const inputRef = useRef(0);

  function handleInputChange () {
    setInput(inputRef.current.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, "나: " + input]);
      inputRef.current.value = null;
    }
  };

  function popUp () {
    const url = "Question"

    window.open(url, "_blank", "width=400, height=400, top=150, left=500");
  }

  function removeMessage () {
    setMessages([]);
  }

  function saveMessage (event) {
    event.preventDefault();


    const bodyString = JSON.stringify({
      "mem_id" : Mem.mem_id,
      "title" : messages[0].replace('나: ', ''),
      "con" : saveMessages
    })

    fetch(`/chatlogs`,
    {
          method : "POST",
          headers : {
            'Content-Type' : "application/json",
          },
          body : bodyString
    }).then(res => {
      console.log(res);
      if(res.ok) {
        console.log(res);
        alert("대화를 저장하였습니다.");
        setMessages([]);
        fetch(`/chatlogs/${Mem.mem_id}`)
        .then( res => {return res.json() })
        .then( data => {console.log(data); setChatlogs(data)});
      } else {
        alert('저장 실패');
      }
    }
    ).catch(() => {
      console.log('error');
    })

  }

    return ( 
    <body className={styles.body}>
      <Link to={"/LoginMain"}><h1 className={styles.logo}>서경챗봇</h1></Link>
      <div className={styles.headBtn}>
          <button className={styles.button} id={styles.saveBtn} onClick={saveMessage}>저장</button>
          <button className={styles.button} id={styles.removeBtn} onClick={removeMessage}>지우기</button>
      </div>
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