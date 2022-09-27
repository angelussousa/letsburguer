import Head from "next/head";
import { Header } from "../../components/Header";
import { setupAPIClient } from "../../services/api";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { useState, useEffect, FormEvent } from 'react'
import { OrderItemProps } from '../dashboard'
import { useRouter } from 'next/router'
import { api } from "../../services/apiClient";


type ItemProps = {
    id: string
    name: string
}
interface CategoryProps {
    categoryList: ItemProps[]
}


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

type ProductProps = {
    id: string,
    name: string,
    price: string
}


export default function Pedidos({ categoryList }: CategoryProps, { orders }: HomeProps) {

    const router = useRouter()
    const table = router.query.table



    const [categorySelect, setCategorySelect] = useState<ItemProps | undefined>()
    const [categories, setCategories] = useState(categoryList || [])

    const [products, setProducts] = useState<ProductProps[] | []>([])
    const [productSelected, setProductSelected] = useState<ProductProps>()

    const [amount, setAmount] = useState('1')
    const [obs, setObs] = useState('')

    const [ordersProps, setOrdersProps] = useState(orders)



    useEffect(()=> {
        async function loadinfo(){
            const response = await api.get('/category')
            setCategories(response.data)
            setCategorySelect(response.data[0])

            console.log(response.data)
        } 
        loadinfo()
        
    }, [])


    useEffect(() => {

        async function loadProducts() {

            const api = setupAPIClient()

            const response = await api.get('category/product', {
              params:{
                category_id: categorySelect?.id
              }
            })

            setProducts(response.data)
            setProductSelected(response.data[0])

             
            
        }
        loadProducts()
    }, [categorySelect])


    function handleChangeCategory(event: ItemProps) {

        setCategorySelect(event.target.value)
        
    }



    function handleChangeProduct(event: ProductProps) {

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

                        <select value={categorySelect} onChange={handleChangeCategory} >

                            {categories.map((item, index) => {


                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}

                        </select>



                        <span>Selecione um Produto</span>

                        
                        <select value={productSelected} onChange={ handleChangeProduct }>

                            {products.length !== 0 && (
                                   <option key={productSelected.id} value={productSelected}>
                                   {productSelected?.name}
                               </option>
                            )}


                            {/* {products.map((item, index) => {


                                return (
                                    <option key={item.id} value={index}>
                                        {item?.name}
                                    </option>
                                )
                            })} */}

                        </select>

                        <div className={styles.amount}>

                            <span>Digite a quantidade</span>
                            <input placeholder="Ex: 3" value={amount} onChange={(e) => setAmount(e.target.value)} />

                        </div>

                        <textarea placeholder="Ex: Tirar cebola..." className={styles.obs} />



                        <button className={styles.btnNext} value={obs} onChange={(e) => setObs(e.target.value)}>
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

    const response = await apiClient.get('/category')

    const params = await apiClient.get('/orders')




    return {

        props: {
            categoryList: response.data,
            orders: params.data
        }


    }

})