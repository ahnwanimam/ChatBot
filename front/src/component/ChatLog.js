import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

    return (
        <div className="form-container">
            <h2>대화 내용</h2>
            {combinedLogs}
        </div>
    );
}
