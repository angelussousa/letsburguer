import styles from './styles.module.scss'
import Head from 'next/head'
import { Header } from '../../components/Header'
import { useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { setupAPIClient } from '../../services/api'
import { api } from '../../services/apiClient'
import { canSSRAuth } from '../../utils/canSSRAuth'


export default function Category() {

    const [name, setName] = useState('')
   

    async function handleRegister(event: FormEvent) {
    event.preventDefault()

        if(name === ''){
            toast.warning('Digite a categoria desejada!')
            return;
        }
        const apiClient = setupAPIClient()
        await apiClient.post('/category', {
            name:name
        })

        toast.success(`Categoria ${name} cadastrada!`)
        setName('')
        
    }


    return (
        <>
            <Head>
                <title>Nova Categoria - Let'sBurguer</title>
            </Head>

            <Header />

            <main className={styles.container}>
                <h1>CADASTRAR CATEGORIA</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input placeholder='Digite a Categoria desejada...' 
                    type='text' 
                    className={styles.input} 
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    />

                    <button type='submit' className={styles.btnAdd}>
                        CADASTRAR
                    </button>
                </form>

            </main>
        </>
    )
}

//PERMISSÃO DE USUÁRIOS LOGADOS

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return{
        props:{}
    }
})

