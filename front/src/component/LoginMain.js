import { Link, useNavigate } from "react-router-dom";
import styles from './LoginMain.module.css';
import { useEffect, useState } from "react";

export default function Main() {

    const [Mem, setMem] = useState({
        "mem_id": null,
        "mem_pw": null,
        "mem_nm": null,
        "mem_mail": null,

    });

    const navigate = useNavigate();

    useEffect( () => {
        fetch(`/member`)
        .then( res => {return res.json() })
        .then( data => {console.log(data); setMem(data)});
    }, []);

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
       
    return (
    <body>
        <div className={styles.logo}>
            <h1>서경챗봇</h1>
        </div>
        <div className={styles.back}>

        </div>
        <div>
            <h2>안녕하세요, {Mem.mem_nm}님!</h2>
        </div>
        <div className={styles.ChatBtn}>
            <button onClick={logout} className={styles.logoutBtn}>로그아웃</button>
        </div>
        <div className={styles.LoginBtn}>
            <Link to={"/LoginChatBot" }><button className={styles.button}>챗봇 입장</button></Link>
        </div>
    </body>
     );
}