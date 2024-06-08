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

useEffect( ()=>  {  
  fetch(`/chatlogs/${Mem.mem_id}`) 
    .then( res => { return res.json() } ) 
    .then( data => {console.log(data); setChatlogs(data)});
}, []) ;

  const inputRef = useRef(0);

  function handleInputChange () {
    setInput(inputRef.current.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      // 사용자 메시지를 추가
      setMessages((prevMessages) => [...prevMessages, "\n나: " + input]);

      // FastAPI 서버에 요청 보내기
      try {
        const response = await fetch(`http://localhost:8000/model?question=${input}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const botMessage = data.answer ? data.answer : '질문을 정확하게 이해하지 못했습니다. 좀 더 자세하게 설명해주신다면 원하시는 답변을 찾아드리겠습니다.';
        // 챗봇 메시지 추가
        setMessages((prevMessages) => [...prevMessages, "\n챗봇: " + botMessage]);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setMessages((prevMessages) => [...prevMessages, "\n챗봇: Error fetching data"]);
      }

      // 입력 필드 초기화
      inputRef.current.value = '';
      setInput('');
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
          <table>
						<tbody>
            {chatlogs.map( (chatlog) => (
                    <tr key = {chatlog.id}> 
                    <td>{chatlog.id}. {chatlog.title}</td><td></td>
                    <br></br>
                    <br></br>
                    </tr>
                  )
                )
            }
            </tbody>
          </table>
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