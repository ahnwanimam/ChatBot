import React, { useRef } from 'react';
import styles from './AddMem.module.css';
import { Link, useNavigate } from 'react-router-dom';

export default function AddMem () {

  const navigate = useNavigate();
  const idRef = useRef(0);
  const pwRef = useRef(0);
  const nameRef = useRef(0);
  const mailRef = useRef(0);


  function addMem(event) {
    event.preventDefault();



    const bodyString = JSON.stringify({
      "memId" : idRef.current.value,
      "memPw" : pwRef.current.value,
      "memNm" : nameRef.current.value,
      "memMail" : mailRef.current.value
    })

    fetch(`/members`,
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
        alert("회원가입 성공.");
        navigate("/Login");
      } else {
        alert('회원가입 실패')
      }
    }
    ).catch(() => {
      console.log('error');
    })
  }


  return (
    <body>
     <Link to={"/"}><h1 className={styles.logo}>서경챗봇</h1></Link>
    <div className={styles.container}>
      <form className={styles.form}>
        <h2>회원가입</h2>
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
        이름
        <div className={styles.inputGroup}>
         <input
            type="text"
            ref = {nameRef}
            required
            className={styles.input}
          />
        </div>
        이메일
        <div className={styles.inputGroup}>
         <input
            type="text"
            ref = {mailRef}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.btn}> 
        <button onClick={addMem} className={styles.button}>회원가입</button>
        </div>
      </form>
    </div>
    </body>
  );
};