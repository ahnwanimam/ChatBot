import React, { useRef } from 'react';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';

export default function Login () {

  const navigate = useNavigate();
  const idRef = useRef(0);
  const pwRef = useRef(0);


  function loginMem() {

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
          navigate("/LoginChatBot");
        }
      })
  }

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }


  return (
    <body>
      <div className={styles.logo}>
            <Typography variant="h2" gutterBottom>
              <Link to={"/"}><HomeIcon sx={{ fontSize: 60 }} /></Link>서경챗봇
            </Typography>
      </div>
    <div className={styles.container}>
      <form className={styles.form}>
        <Typography variant="h5" gutterBottom sx={{textAlign: 'center'}}>
          로그인
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
            onKeyPress={(e) => e.key === 'Enter' && loginMem()}
            className={styles.input}
          />
        </div>
        <div className={styles.signInBtn}>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green'}} onClick={loginMem}>로그인</Button>
        </div>
            <div className={styles.signUpBtn}> 
        <Link to={"/AddMem"}>
          <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green'}}>회원가입</Button>
        </Link>
        </div>
        <div className={styles.right}></div>
      </form>
    </div>
    </body>
  );
};

