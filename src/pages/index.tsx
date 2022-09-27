import Head from 'next/head'
import Image from 'next/image'
import logoPng from '../../public/logo.png'
import styles from '../../styles/home.module.scss'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { AuthContext } from '../contexts/AuthContext'
import { useContext, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { canSSRGuest } from '../utils/canSSRGuest'





export default function Home() {

  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {

      toast.error('Preencha corretamente seus dados!')

      return;


    }


    setLoading(true)


    let data = {
      email, password
    }

    await signIn(data)
    setLoading(false)

  }

  return (
    <>
      <Head>
        <title>Let'sBurguer - Faça seu login</title>
      </Head>

      <div className={styles.containerCenter}>
        <Image className={styles.logo} src={logoPng} alt="Logo LetsBurguer" />
        <div className={styles.login}>


          <form onSubmit={handleLogin}>

            <Input
              placeholder='Digite seu email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button
              type="submit"
              loading={loading}
            >
              ACESSAR
            </Button>
          </form>

          <Link href="signup">
            <a className={styles.text}>Não possui uma conta? CADASTRE-SE</a>
          </Link>
        </div>
      </div>
    </>

  )
}


export const getServerSideProps = canSSRGuest(async(ctx)=>{
    return{
      props:{}
    }
})