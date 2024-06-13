import { Link } from "react-router-dom";
import styles from './Main.module.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

export default function Main() {

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
                서경챗봇
            </Typography>
        </div>
        <div className={styles.back}>

        </div>
        <div className={styles.LoginBtn}>
            <Link to={"/Login" }><Button variant="outlined" size="large" sx={{color: 'green', borderColor: 'green'}}>로그인</Button></Link>
        </div>
        <div className={styles.ChatBtn}>
            <Link to={"/ChatBot" }><Button variant="outlined" size="large" sx={{color: 'green', borderColor: 'green'}}>게스트 입장</Button></Link>
        </div>
    </body>
     );
}