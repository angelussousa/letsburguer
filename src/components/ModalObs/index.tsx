import Modal from 'react-modal'
import styles from './styles.module.scss'

import { FiX } from 'react-icons/fi'
import {ItemProps} from '../../pages/pedidos/[oID]';

interface ModalObsPedidosProps{
    isOpen: boolean
    onRequestClose: () => void;
    item: ItemProps[]
    
}


export function ModalObsPedidos({isOpen, onRequestClose, item}:ModalObsPedidosProps){
   
   const customStyles = {

    content:{
        top: '50%',
        bottom:'auto',
        left:'50%',
        right:'auto',
        padding:'30px',
        transform:'translate(-50%, -50%)',
        backgroundColor:'#1d1d2e'
    }
   }
   
    return(
        <Modal  isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} >

            <button type='button' onClick={onRequestClose} className='react-modal-close' style={{background:'transparent', border:0}}>
                    <FiX size={45} color='#F34748'/>
            </button>

            <div className={styles.container}>

                    <div className={styles.detail}>
                        <h2>Observaçoes do Pedido </h2>
                        
                   </div>

                    {item.map(item => (
                        <section key={item.id} className={styles.containerItem}>
                                <div className={styles.pedido}>
                                    <strong>{item.produto} - </strong><h3>{item.obs}</h3>
                                </div>
                                                        
                        </section>
                    ))}

                   
            </div>


        </Modal>
    )
}