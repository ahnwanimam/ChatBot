import React, { useRef } from 'react';
import styles from './AddMem.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function AddMem () {

  const navigate = useNavigate();
  const idRef = useRef(0);
  const pwRef = useRef(0);
  const nameRef = useRef(0);
  const mailRef = useRef(0);


  function addMem(event) {
    event.preventDefault();



    const bodyString = JSON.stringify({   //회원가입창에 입력한 값을 json 형식으로 만든다.
      "memId" : idRef.current.value,
      "memPw" : pwRef.current.value,
      "memNm" : nameRef.current.value,
      "memMail" : mailRef.current.value
    })

    //fetch 함수로 접근해 회원가입 창에서 입력한 값을 POST 매핑으로 백엔드 서버에 넘겨 DB에 등록.
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
      <div className={styles.logo} style={{marginTop: '100px'}}>
        <Link to="/" className={styles.link}></Link>
      </div>
      <div className={styles.container} style={{marginTop: '30px'}} >
      <form className={styles.form}>
        <Typography variant="h5" gutterBottom sx={{textAlign: 'center'}}>
          회원가입
        </Typography>
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
        <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' }} onClick={addMem}>회원가입</Button>
        </div>
      </form>
    </div>
    </body>
  );
};