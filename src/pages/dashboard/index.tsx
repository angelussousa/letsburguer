import { canSSRAuth } from "../../utils/canSSRAuth"
import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import Head from "next/head"
import { Header } from "../../components/Header"
import styles from './styles.module.scss'
import { FiRefreshCcw } from 'react-icons/fi'
import { setupAPIClient } from "../../services/api"
import Modal from 'react-modal'
import {ModalOrder} from '../../components/ModalOrder'

type OrderProps = {
    id: string
    table: string | number
    status: boolean
    draft: boolean
    name: string | null
}

interface HomeProps {
    orders: OrderProps[]
}

export type OrderItemProps = {
    id: string
    amount: number
    product: {
        id: string
        name:string
        description:string
        price:string
        banner:string
    }
    product_id: string
    order_id: string
    order:{
        id: string
        table: string | number
        status: boolean
        name: string | null
        
    }
}

export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || [])

    const { user } = useContext(AuthContext)

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)


    function handleCloseModal(){
        setModalVisible(false)
    }

    async function handleOpenModalView(id: string) {
       
       const apiClient = setupAPIClient()
       const response = await apiClient.get('/order/detail',{
        params: {
            order_id: id,
        }
       })

       setModalItem(response.data)
       setModalVisible(true)
        
    }

    async function handleFinishModal(id: string){

        const apiClient = setupAPIClient();
        await  apiClient.put('/order/end', {
            order_id: id,
        })

        const response = await apiClient.get('/orders');


        setOrderList(response.data)

        setModalVisible(false)
    }


    async function handleRefreshOrders(){

        const apiClient = setupAPIClient();
        

        const response = await apiClient.get('/orders');
        setOrderList(response.data)
    }



    Modal.setAppElement('#__next');

    return (


        <>
            <Head>
                <title>Painel - Let'sBurguer</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>

                        <h1>Últimos Pedidos</h1>
                        <button onClick={ handleRefreshOrders}>
                            <FiRefreshCcw color='#3fffae' size={25} />
                        </button>

                    </div>

                    <article className={styles.listOrders}>

                        {orderList.length === 0 && (
                            <span className={styles.emptyList}>Nenhum pedido aberto...</span>
                        )}

                        {orderList.map(item => (
                            <section className={styles.orderItem} key={item.id}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}> </div>
                                    <span>Mesa {item.table} - {item.name} </span>
                                </button>
                            </section>
                        ))}


                    </article>

                </main>


            {modalVisible && 
            (
             <ModalOrder isOpen={modalVisible} onRequestClose={handleCloseModal} handleFinishOrder={handleFinishModal}order={modalItem}/>
            )}


            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/orders')

    return {
        props: {

            orders: response.data

        }
    }
})