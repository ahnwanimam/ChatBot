import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import styles from './ChatLog.module.css';

export default function ChatLog() {
    const [chatlogs, setChatlogs] = useState({ con: "", conBot: "" });
    const { id } = useParams();

    useEffect(() => {
        fetch(`/chatlogsid/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setChatlogs(data);
            })
            .catch(error => {
                console.error('Error fetching chatlogs:', error);
                setChatlogs({ con: "", conBot: "" }); // 오류가 발생할 경우 빈 문자열로 초기화
            });
    }, [id]);


    const conArray = (chatlogs.con || "").split('\t');
    const conBotArray = (chatlogs.conBot || "").split('\t');


    const combinedLogs = [];
    for (let i = 0; i < conArray.length; i++) {
        combinedLogs.push(<p key={`con-${i}`}>{conArray[i]}</p>);
        combinedLogs.push(<p key={`con-${i}.join('\n')`}></p>);
        combinedLogs.push(<p key={`conBot-${i}`}>{conBotArray[i]}</p>);
        combinedLogs.push(<p key={`conBot-${i}.join('\n')`}></p>);
    }
    console.log(combinedLogs);

    function deleteChatlog (event) {
        event.preventDefault();

        const bodyString = JSON.stringify({
            "isDeleted" : 1
          })


          fetch(`/chatlogsid/${id}`,
            {
                  method : "PUT",
                  headers : {
                    'Content-Type' : "application/json",
                  },
                  body : bodyString
            }).then(res => {
              console.log(res);
              if(res.ok) {
                console.log(res);
                alert("삭제 완료.");
                window.close();
              } else {
                alert('삭제 실패')
              }
            }
            ).catch(() => {
              console.log('error');
            })
          }



    return (
        <div className="form-container">
            <h2>대화 내용</h2>
            {combinedLogs}
            <Button variant="outlined" size='mid' sx={{color: 'green', borderColor: 'green' , marginLeft: '20px'}} onClick={deleteChatlog}>삭제</Button>
        </div>
    );
}