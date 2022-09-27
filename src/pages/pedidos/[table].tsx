import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { OrderItemProps } from '../dashboard'
import { useRouter } from 'next/router'
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



export default function Pedidos({ orders }: HomeProps) {

    const router = useRouter()
    const table = router.query.table



    const [categories, setCategories] = useState<CategoryProps[] | []>([])
    const [categorySelect, setCategorySelect] = useState('')



    const [productSelected, setProductSelected] = useState()
    const [products, setProducts] = useState<ProductProps[] | []>([])

    const [amount, setAmount] = useState('')
    const [obs, setObs] = useState('')

    const [ordersProps, setOrdersProps] = useState(orders)



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


    return (

        <>
            <Head>
                <title>Pedidos - let'sBurguer</title>
            </Head>
            <Header />
            <main className={styles.container}>

                <h1>Pedido - Mesa {table}</h1>
                <form>


                    <div className={styles.divCategory}>

                        <span>Selecione uma Categoria</span>

                        <select value={categorySelect} onChange={handleChangeCategory}  >

                            {categories.map((item, index) => {


                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}

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


                            {/* {products.length !== 0 && (
                                   <option key={productSelected?.id} >
                                   {productSelected?.name}
                               </option>
                            )} */}

                        </select>

                        <div className={styles.amount}>

                            <span>Digite a quantidade</span>
                            <input placeholder="Ex: 3" value={amount} onChange={(e) => setAmount(e.target.value)} />

                        </div>

                        <textarea placeholder="Ex: Tirar cebola..." className={styles.obs} value={obs} onChange={(e) => setObs(e.target.value)} />



                        <button className={styles.btnNext} >
                            AVANÇAR
                        </button>

                    </div>

                </form>
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