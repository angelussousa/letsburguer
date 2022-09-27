import styles from './styles.module.scss'
import Link from 'next/link'
import { AuthContext } from '../../contexts/AuthContext'
import {FiLogOut} from 'react-icons/fi'
import { useContext } from 'react'


export function Header(){

    const {signOut} = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
           <div className={styles.headerContent}>

                <Link href='/dashboard'>
                    <img src='/logo.png' width={90} height={90}/>
                </Link>
                <nav className={styles.menuNav}>

                    <Link  href='/order'>
                        <a className={styles.openOrder} style={{backgroundColor:'#ce222d', padding:15, borderRadius:5}}>INICIAR PEDIDO</a>
                    </Link>

                    <Link href='/category'>
                        <a>NOVA CATEGORIA</a>
                    </Link>

                    <Link href='/product'>
                        <a>NOVO PRODUTO</a>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color='#FFF' size={25}/>
                    </button>
                </nav>
           </div>
        </header>
    )
}