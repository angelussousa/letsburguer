import { useState, FormEvent, useContext } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import logoPng from '../../../public/logo.png'
import styles from '../../../styles/home.module.scss'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import Link from 'next/link'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

export default function SignUp() {

    const { signUp } = useContext(AuthContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    async function handleSignUp(event: FormEvent) {
        event.preventDefault()

        if (name === '' || email === '' || password === '') {

            toast.warning('Preencha os campos corretamente!')

            return;
        }

        setLoading(true)

        let data = {
            name, email, password
        }

        await signUp(data)
        setLoading(false);
    }

    return (


        <>
            <Head>
                <title>Let'sBurguer - Cadastre-se agora!</title>
            </Head>

            <div className={styles.containerCenter}>
               
                    <Image className={styles.logo} src={logoPng} alt="Logo LetsBurguer" />
                    <div className={styles.login}>

                        <h1>Crie sua conta!</h1>

                        <form onSubmit={handleSignUp}>

                            <Input placeholder='Digite seu nome'
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)} />

                            <Input placeholder='Digite seu email'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />

                            <Input placeholder='Digite sua senha'
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />

                            <Button type="submit" loading={loading}  >
                                CADASTRAR
                            </Button>

                        </form>

                        <Link href="/">
                            <a className={styles.text}>J?? ?? cadastrado? Fa??a o Login</a>
                        </Link>
                    </div>
                
            </div>
        </>

    )
}
