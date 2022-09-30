import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { OrderItemProps } from '../dashboard'
import { useRouter, withRouter } from 'next/router'
import { api } from "../../services/apiClient";



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

type ItemProps = {
    id: string,
    name: string,
    product_id: string,
    amount: string | number
}





export default function Pedidos({ orders }: HomeProps) {

    const router = useRouter()
    const table = router.query.table
    const orderID = router.query.oID
    


    const [categories, setCategories] = useState<CategoryProps[] | []>([])
    const [categorySelect, setCategorySelect] = useState('')



    const [productSelected, setProductSelected] = useState('')
    const [products, setProducts] = useState<ProductProps[] | []>([])

    const [amount, setAmount] = useState('')
    const [items, setItems] = useState([])

    const [obs, setObs] = useState('')

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

            // console.log(categories[categorySelect])
            // console.log(categorySelect?.id)

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



    function handleChangeProduct(event) {

        setProductSelected(event.target.value)
    }


    function addItems(){
        event.preventDefault()

       

        
        let prod = {products: products[productSelected]}
        let item = {produto: prod.products?.name, qnt: amount, obs: obs }

        setItems(oldArray => [...oldArray, item])
        setObs('')
        setAmount('')

        
        console.log(ordersProps)
       
       
    }


    async function addOrder() {

        event.preventDefault()
        const apiClient = setupAPIClient()

        const response = await apiClient.get('/orders')

        // const response = await api.post('order/add', {
            
        // })
        console.log(response.data.name)
        console.log(orderID)
        
        console.log(response.data)
        console.log(ordersProps)
        
    }


    return (

        <>
            <Head>
                <title>Pedidos - let'sBurguer</title>
            </Head>
            <Header />
            <main className={styles.container}>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', }}>

                <h1>Pedido - Mesa {table}{orderID}</h1>
                
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

                        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'center', justifyItems:'center'}}>

                           <h1 style={{marginLeft: 30}}>Itens do Pedido</h1>

                            <div className={styles.items}>
                                <span>
                               {items.map((item, index) => {

                                return(
                                    <span key={item.products}  > 
                                    {item.qnt} {item.produto}<br/> </span>
                                )
                               })}
                                </span>

                               
                            </div>

                                <button className={styles.btnNext} onClick={addOrder} >
                                AVANÇAR
                                </button>
                        </div>       
                    </div>
                </form>
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