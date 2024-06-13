import styles from './LoginChatBot.module.css';
<<<<<<< HEAD
import React, { useRef, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
=======
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
>>>>>>> Deokhwan

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
<<<<<<< HEAD
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
=======
  const saveMessages = messages.filter((msg) => msg.startsWith("나:"));
  const saveMessagesBot = messages.filter((msg) => msg.startsWith("챗봇:"));
>>>>>>> Deokhwan

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
<<<<<<< HEAD
      setMessages([...messages, "나: " + input]);
      inputRef.current.value = null;
=======
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
>>>>>>> Deokhwan
    }
  };

  function popUp() {
    const url = "Question";
    window.open(url, "_blank", "width=400, height=400, top=150, left=500");
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> Deokhwan
        console.log(res);
        alert("대화를 저장하였습니다.");
        setMessages([]);
        fetch(`/chatlogs/${Mem.mem_id}`)
<<<<<<< HEAD
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
=======
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
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

  return (
      <div className={styles.body}>
          <div className={styles.logo}>
            <Typography variant="h2" gutterBottom>
              <Link to={"/"}><HomeIcon sx={{ fontSize: 60 }} /></Link>서경챗봇
            </Typography>
          </div>
        <div class={styles.Mem}>
          <Typography variant="h6" gutterBottom>
            안녕하세요, {Mem.mem_nm}님!
          </Typography>
>>>>>>> Deokhwan
        </div>
        <div className={styles.headBtn}>
          <button onClick={logout} class={styles.logoutBtn}>로그아웃</button>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={saveMessage}>저장</Button>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={removeMessage}>지우기</Button>
        </div>
        <div className={styles.wrap}>
          <div className={styles.left}>
            <table>
              <tbody>
              {chatlogs.map((chatlog) => (
                  <tr key={chatlog.id}>
                    <Button variant='text' size='large' sx={{color: 'green'}} onClick={() => window.open("ChatLog/" + (chatlog.id), "_blank", "width=400, height=400, top=150, left=500")}>{chatlog.id}. {chatlog.title}</Button>
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
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={handleSendMessage}>전송</Button>
          <div className={styles.question}>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={popUp}>질문요청</Button>
          </div>
        </div>
      </div>
  );
}