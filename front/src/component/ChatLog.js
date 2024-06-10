import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ChatLog() {
  const [chatlogs, setChatlogs] = useState([]);

  const {id} = useParams();

  
  useEffect( () => {
    fetch(`/chatlogsid/${id}`)
    .then( res => {return res.json()})
    .then( data => {console.log(data); setChatlogs(data)});

  }, []);
  

  

  return (
    <div className="form-container">
        <h2>대화 내용</h2>
        <p>{chatlogs.con}</p>
    </div>
  );
}