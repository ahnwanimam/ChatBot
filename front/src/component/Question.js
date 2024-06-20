import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import styles from './Question.module.css';
import Typography from '@mui/material/Typography';

export default function Question() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  
  const conRef = useRef(0);
  const cateRef = useRef(0);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bodyString = JSON.stringify({
        "con" : conRef.current.value,
        "category" : cateRef.current.value
      })

      fetch(`/questions`,
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
          alert("등록되었습니다.");
        } else {
          alert('요청 실패.')
        }
      }
      ).catch(() => {
        console.log('error');
      })

    setContent('');
    setCategory('');
  };

  return (
    <div className={styles.container}>
      <Typography variant="h5" gutterBottom sx={{textAlign:"center", marginTop: "5%"}}>
        질문 요청하기
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={styles.group}>
          <div className="form-group">
            <label htmlFor="content">Content: </label>
            <textarea
              id="content"
              ref={conRef}
              onChange={handleContentChange}
              placeholder="답변을 듣지 못한 질문을 알려주세요!"
              required
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              ref={cateRef}
              onChange={handleCategoryChange}
              required
            >
              <option value="0">학교 시설의 위치 및 이동경로</option>
              <option value="1">동아리 종류</option>
              <option value="2">학과별 졸업요건 및 취업진로</option>
            </select>
          </div>
        </div>
        <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} type='submit'>질문 요청하기</Button>
      </form>
    </div>
  );
}