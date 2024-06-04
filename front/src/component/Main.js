import { Link } from "react-router-dom";
import styles from './Main.module.css';

export default function Main() { 
       
    return (
    <body>
        <div className={styles.logo}>
            <h1>서경챗봇</h1>
        </div>
        <div className={styles.back}>

        </div>
        <div className={styles.LoginBtn}>
            <Link to={"/Login" }><button className={styles.button}>로그인하기</button></Link>
        </div>
        <div className={styles.ChatBtn}>
            <Link to={"/ChatBot" }><button className={styles.button}>게스트로 입장</button></Link>
        </div>
    </body>
     );
}