import styles from './styles.module.scss'
import { Header } from '../../components/Header'
import Head from 'next/head'
import Router from 'next/router'
import { useState, FormEvent  } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'








export default function Order() {

    const [numeroMesa, setNumeroMesa] = useState('')
    const [nomeMesa, setNomeMesa] = useState('')
    
   


   async function handleOpenOrder( event: FormEvent) {

    event.preventDefault()
    


        if(numeroMesa === "" || nomeMesa === ''){
            return;
        }

       

        const apiClient = setupAPIClient()

         const response = await apiClient.post('/order', {

            name: nomeMesa,
            table: Number(numeroMesa),
            
            
         })

         console.log(response.data)
        
         toast.success(`Mesa ${numeroMesa} aberta!`)

       
         setNumeroMesa('')
         setNomeMesa('')
         
         
         Router.push(`/pedidos/${response.data.id}` )
        }







return (


    <>

        <Head>
            <title>Novo Pedido - Let'sBurguer</title>
        </Head>

        <Header />

        <main className={styles.container}>

            <h1>ABRIR MESA</h1>

            <form className={styles.form} onSubmit={ handleOpenOrder }>
                <input placeholder='Digite o número da mesa...'
                    type='text'
                    className={styles.input}
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                />
                <input placeholder='Digite um nome para o cliente...'
                    type='text'
                    className={styles.input}
                    value={nomeMesa}
                    onChange={(e) => setNomeMesa(e.target.value)}
                />

                <button type='submit' className={styles.btnAdd}>
                    ABRIR MESA
                </button>
            </form>

        </main>

    </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {


    return{
        props:{}
    }
})