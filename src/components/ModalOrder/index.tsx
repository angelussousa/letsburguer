import Modal from 'react-modal'
import styles from './styles.module.scss'

import { FiX } from 'react-icons/fi'
import{OrderItemProps} from '../../pages/dashboard'

interface ModalOrderProps{
    isOpen: boolean
    onRequestClose: () => void;
    order: OrderItemProps[]
    handleFinishOrder: (id: string) => void
}


export function ModalOrder({isOpen, onRequestClose, order, handleFinishOrder}:ModalOrderProps){
   
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
                        <h2>Detalhes do Pedido</h2>
                            <div>
                                 <strong>MESA</strong><span className={styles.tableNum}>  {order[0].order.table}</span>
                            </div>
                    </div>



                    {order.map(item => (
                        <section key={item.id} className={styles.containerItem}>
                                <div className={styles.pedido}>
                                    <span className={styles.amount}>{item.amount}</span><span> - <strong>{item.product.name}</strong> </span>
                                </div>
                            <span className={styles.description}>{item.product.description}</span>
                            <span>R$ {item.product.price}</span>
                        </section>
                    ))}

                    <button className={styles.btnOrder} onClick= { ()=> handleFinishOrder(order[0].order_id) } >
                        Finalizar Pedido
                    </button>
            </div>


        </Modal>
    )
}