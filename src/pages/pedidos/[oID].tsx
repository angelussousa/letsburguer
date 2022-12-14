import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useRouter, withRouter } from 'next/router'
import { api } from "../../services/apiClient";
import { FiTrash2, FiEdit3 } from 'react-icons/fi'
import { toast } from "react-toastify";
import {ModalObsPedidos} from '../../components/ModalObs/index';



type OrderProps = {
    id: string
    table: string | number
    status: boolean
    draft: boolean
    name?: string | null
}

interface HomeProps {
    orders: OrderProps[]

}
export type CategoryProps = {
    id: string
    name: string
}
type ProductProps = {
    id: string,
    name: string,
    price: string
}

export type ItemProps = {
    
    id: string,
    name: string,
    product_id: string,
    obs: string,
    amount: string | number
}

interface Items {
    items:{
        id: string,
        produto: string,
        product_id: string,
        obs: string,
        amount: string | number
    }
    deleteItem: (item_id:string) => void
}




export default function Pedidos({ orders }: HomeProps) {

    const router = useRouter()
    
    const { oID } = router.query



    const [categories, setCategories] = useState<CategoryProps[] | []>([])
    const [categorySelect, setCategorySelect] = useState('')



    const [productSelected, setProductSelected] = useState('')
    const [products, setProducts] = useState<ProductProps[] | []>([])

    const [amount, setAmount] = useState(null)
    const [items, setItems] = useState([])

    const [obs, setObs] = useState('')

    //MODAL
    const [modalItem, setModalItem] = useState<ItemProps[] | []>(items)
    const [modalVisible, setModalVisible] = useState(false)


    const [ordersProps, setOrdersProps] = useState<OrderProps[]>(orders)





    useEffect(() => {
        async function loadinfo() {

            const response = await api.get('/category')

            setCategories(response.data)

            setCategorySelect(response.data[0])


        }
        loadinfo()

    }, [])


    useEffect(() => {

        async function loadProducts() {

    

            const response = await api.get('/category/product', {

                params: {
                    category_id: categories[categorySelect]?.id
                }
            })

            setProducts(response.data)
            setProductSelected(response.data[categories[categorySelect]])



        }
        loadProducts()
    }, [categorySelect])


    function handleChangeCategory(event) {

        setCategorySelect(event.target.value)





    }

    async function handleOpenModalView(id: string) {
        event.preventDefault()

        
        const apiClient = setupAPIClient()
        const response = await apiClient.get('/order/detail',{
         params: {
             order_id: id,
            
         }
        })
 
        setModalItem(response.data)
        setModalVisible(true)
 
       
       
         
     }

     function handleCloseModal(){
        setModalVisible(false)
    }

    function handleChangeProduct(event) {

        setProductSelected(event.target.value)
    }




    async function addItems() {

        event.preventDefault()
        const apiClient = setupAPIClient()
        let prod = { products: products[productSelected] }


        // console.log(oID)

        const response = await apiClient.post('order/add', {
            order_id: oID,
            product_id: prod.products?.id,
            amount: Number(amount),
        })

        let item = {
            produto: prod.products?.name,
            qnt: amount,
            obs: obs,
            id: response.data.id,
            product_id: products[productSelected].id,
        }

        if(amount == 0 || amount == null){
            toast.warn('Voc?? precisa dizer a quantidade!')
        }else{
            setItems(oldArray => [...oldArray, item])
        setObs('')
        setAmount(null) 
        }
       


        // console.log(amount)
        // console.log(item)

    }


    async function handleDelete(e){
        event.preventDefault()
        
        // let idP = e
        // console.log(idP)
        
        const response = await api.delete('/order/remove', {
            params: {
                item_id: e
            }
        })

        let removeItem = items.filter( item => {
            return( item.id !== e )
        })

            setItems(removeItem)

    }

    return (

        <>
            <Head>
                <title>Pedidos - let'sBurguer</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>

                    <h1>Pedido - Mesa </h1>

                    <form>


                        <div className={styles.divDivisao}>

                            <div className={styles.divCategory}>

                                <span>Selecione uma Categoria</span>

                                <select value={categorySelect} onChange={handleChangeCategory}  >

                                    {categories.map((item, index) => {


                                        return (
                                            <option key={item.id} value={index}>
                                                {item.name}
                                            </option>
                                        )
                                    }).reverse()}

                                </select>

                                <span>Selecione um Produto</span>

                                <select value={productSelected} onChange={handleChangeProduct}  >

                                    {products.map((item, index) => {


                                        return (
                                            <option key={item.id} value={index}>
                                                {item.name}
                                            </option>
                                        )
                                    })}

                                </select>

                                <div className={styles.amount}>

                                    <span>Digite a quantidade</span>
                                    <input placeholder="Ex: 3" value={amount} onChange={(e) => setAmount(e.target.value)} />

                                </div>

                                <textarea placeholder="Ex: Tirar cebola..." className={styles.obs} value={obs} onChange={(e) => setObs(e.target.value)} />


                                <button className={styles.btnAdd} onClick={addItems}>
                                    ADICIONAR
                                </button>

                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', justifyItems: 'center' }}>

                                <h1 style={{ marginLeft: 30 }}>Itens do Pedido</h1>

                                <div className={styles.items}>
                                    <span>
                                        {items.map((item, index) => {

                                            return (
                                                <div className={styles.divItem} key={item.id}>

                                                    <div className={styles.itemInt}>
                                                        <span style={{ color: '#FF000F', fontSize: 21, fontWeight: 'bold', backgroundColor: '#FFF', paddingInline: 10, borderRadius: 6 }}>{item.qnt}</span>
                                                        <span style={{ color: '#000' }} > {item.produto}
                                                        
                                                        {/* BOT??O DE EXCLUIR */}

                                                         <button
                                                            onClick={()=>handleDelete(item.id)}
                                                          className={styles.btnTrash} ><FiTrash2 size={20} color='#FF3F4B' />
                                                          </button>
                                                         {/* BOT??O DE DETALHES */}
                                                          <button>


                                                            <FiEdit3
                                                            onClick={()=>handleOpenModalView(item.id)}
                                                            className={styles.btnObs} size={20} color='#FF3F4B' />
                                                          </button>
                                                         </span>
                                                         
                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </span>


                                </div>

                                <button className={styles.btnNext} >
                                    AVAN??AR
                                </button>

                                
                            </div>
                        </div>
                    </form>




                    {modalVisible && 
            (
             <ModalObsPedidos isOpen={modalVisible} onRequestClose={handleCloseModal} item={items}/>
            )}

                </div>
            </main>
        </>


    )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)



    const params = await apiClient.get('/orders')




    return {

        props: {
            orders: params.data
        }

    }


})