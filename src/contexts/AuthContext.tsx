import { type } from 'os';
import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../services/apiClient';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { toast } from 'react-toastify'


type AutContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>
}

type UserProps = {
    id: string
    name: string
    email: string
}

type SignInProps = {
    email: string
    password: string
}

type AuthProviderProps = {
    children: ReactNode
}

type SignUpProps = {
    name: string
    email: string
    password: string
}



export const AuthContext = createContext({} as AutContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch {
        console.log('Erro ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(()=> {

        //TENTAR PEGAR O TOKEN
        const {'@nextauth.token': token} = parseCookies()

        if(token){
            api.get('/me').then(response => {
                const { id, name, email } = response.data;
            
                setUser({
                    id, name, email
                })
            
            })
            .catch(()=>{
                signOut()
            })
        }

    },[])


    async function signIn({ email, password }: SignInProps) {
        try {

            const response = await api.post('/session', {
                email, password
            })
            // console.log(response.data)
            const { id, name, token } = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expira em 1 mes
                path: "/"
            })
            setUser({
                id, name, email
            })

            //PASSAR O TOKEN PARA PRÓXIMAS REQUISIÇÕES
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            //REDIRECIONAR O USER PARA /dashboard
            toast.success("Bem vindo ao Let's Burguer ")
            Router.push('/dashboard')

        } catch (err) {
            toast.error('Ops! Algo deu errado...')
            console.log('erro ao acessar' + err)

        }
    }

    async function signUp({ name, email, password }: SignUpProps) {
        try {

            const response = await api.post('/users', {
                name, email, password
            })

            toast.success('Usuário cadastrado com sucesso!')


            Router.push('/')

        } catch (err) {
            toast.error('Ops! Algo de errado não está certo...')
            console.log('Erro ao cadastrar o usuário' + err)
        }
    }

    return (

        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>

    )

}
