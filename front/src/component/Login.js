import React, { useRef } from 'react';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Login () {

  const navigate = useNavigate();
  const idRef = useRef(0);
  const pwRef = useRef(0);


  function loginMem(event) {
    event.preventDefault();

    const bodyString = JSON.stringify({
      "memId" : idRef.current.value,
      "memPw" : pwRef.current.value
    })

    fetch(`/login`,
    {
          method : "POST",
          headers : {
            'Content-Type' : "application/json",
          },
          body : bodyString
    }).then(res => {
      return res.text();
      }).then(text => {
        if(text === '로그인 실패') alert('아이디나 비밀번호를 확인하세요.')
        else if(text ==='로그인 성공!')  {
          alert('로그인 성공');
          navigate("/LoginMain");
        }
      })
  }


  return (
    <body>
        <Link to={"/"}><h1 className={styles.logo}>서경챗봇</h1></Link>
    <div className={styles.container}>
      <form className={styles.form}>
        <h2>로그인</h2>
        아이디
        <div className={styles.inputGroup}>
           <input
            type="text"
            ref = {idRef}
            required
            className={styles.input}
          />
        </div>
        비밀번호
        <div className={styles.inputGroup}>
           <input
            type="password"
            ref = {pwRef}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.btn}>
            <button onClick={loginMem} className={styles.button}>로그인</button>
        </div>
            <div className={styles.btn}> 
        <Link to={"/AddMem"}><button className={styles.button}>회원가입</button></Link>
        </div>
      </form>
    </div>
    </body>
  );
};

