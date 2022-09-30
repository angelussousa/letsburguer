import Head from "next/head";
import styles from './styles.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { FiUpload } from 'react-icons/fi'
import { ChangeEvent, useState, FormEvent } from "react";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";


type ItemProps = {
    id: string
    name: string
}
interface CategoryProps {
    categoryList: ItemProps[]
}

export default function Product({ categoryList }: CategoryProps) {

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')


    

    const [avatarUrl, setAvatarUrl] = useState('')
    const [imgAvatar, setImgAvatar] = useState(null)

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelect, setCategorySelect] = useState(0)




    function handleFile(e: ChangeEvent<HTMLInputElement>) {

        // if (!e.target.files) {
        //     return;
        // }
        const img = e.target.files[0];

        if (!img) {
            return;
        }
        if (img.type === 'image/jpeg' || img.type === 'image/png') {
            setImgAvatar(img)
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }

    }


    function handleChangeCategory(event) {
        setCategorySelect(event.target.value)
    }


    async function handleRegister(event: FormEvent) {
        event.preventDefault()


        try {
            const data = new FormData();

            if (name === '' || price === '' ) {
                toast.warning('Preencha os campos!')
                return;
            }

            data.append('name', name);
            data.append('price', price)
            data.append('description', description);
            data.append('category_id', categories[categorySelect].id)
            data.append('file', imgAvatar)

            const apiClient = setupAPIClient()

            await apiClient.post('/product', data)

            toast.success('Produto cadastrado com sucesso!')



        } catch (err) {
            toast.error('Ops! Algo deu errado...')
            console.log(err)
        }

        setName('')
        setPrice('')
        setDescription('')
        setAvatarUrl('')

    }

    return (

        <>
            <Head>
                <title>Novo Produto - Let'sBurguer</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>


                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color='#FFF' />
                            </span>

                            <input type='file'
                                accept="image/png, image/jpeg"
                                onChange={handleFile}
                            />

                            {avatarUrl &&
                                (
                                    <img
                                        className={styles.preview}
                                        src={avatarUrl}
                                        alt='Foto do Produto'
                                        width={250}
                                        height={250}
                                    />
                                )}

                        </label>


                        <select value={categorySelect} onChange={handleChangeCategory}>

                            {categories.map((item, index) => {
                                return (

                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}

                        </select>

                        <input placeholder="Digite o produto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type='text'
                            className={styles.input}
                        />

                        <input placeholder="Valor do produto"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            type='text'
                            className={styles.input}
                        />

                        <textarea placeholder="Descreva o produto..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.input}
                        />

                        <button className={styles.btnAdd} type='submit'>
                            CADASTRAR
                        </button>



                    </form>

                </main>


            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category')


    return {
        props: {
            categoryList: response.data
        }
    }
})