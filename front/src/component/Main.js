import { Link } from "react-router-dom";
import styles from './Main.module.css';
import Button from '@mui/material/Button';

export default function Main() {

       
    return (
    <body>
        <div className={styles.logo} style={{marginTop: '100px'}} >
        </div>
        <div style={{marginTop: '30px'}} >
            <div className={styles.back} >
            </div>
            <div style={{marginTop: '10px'}} >
                <div className={styles.LoginBtn}>
                    <Link to={"/Login"}><Button variant="outlined" size="large"
                                                sx={{color: 'green', borderColor: 'green'}}>로그인</Button></Link>
                </div>
                <div className={styles.ChatBtn}>
                    <Link to={"/ChatBot"}><Button variant="outlined" size="large"
                                                  sx={{color: 'green', borderColor: 'green'}}>게스트 입장</Button></Link>
                </div>
            </div>
        </div>

    </body>
    );
}