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

    // chatlogs.con과 chatlogs.conBot을 줄바꿈 기준으로 분할
    const conArray = (chatlogs.con || "").split('\n');
    const conBotArray = (chatlogs.conBot || "").split('\n');

    // 두 배열의 길이를 고려하여 번갈아가며 출력할 요소 생성
    const combinedLogs = [];
    for (let i = 0; i < Math.max(conArray.length, conBotArray.length); i++) {
        if (i < conArray.length) {
            combinedLogs.push(<p key={`con-${i}`}>{conArray[i]}</p>);
        }
        if (i < conBotArray.length) {
            combinedLogs.push(<p key={`conBot-${i}`}>{conBotArray[i]}</p>);
        }
    }

    return (
        <div className="form-container">
            <h2>대화 내용</h2>
            {combinedLogs}
        </div>
    );
}
