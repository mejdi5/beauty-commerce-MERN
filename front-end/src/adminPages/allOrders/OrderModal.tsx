import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useTypedSelector } from '../../Redux/Hooks'
import {ProductType} from '../../Redux/productSlice'
import {CartProduct} from '../../Redux/cartSlice'
import AddIcon from '@mui/icons-material/Add';


interface Props {
  showModal: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  orderProducts: CartProduct[],
  setOrderProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>
}

const OrderModal: React.FC<Props> = ({showModal, setShowModal, orderProducts, setOrderProducts}) => {

  const products = useTypedSelector<ProductType[] | never[]>(state => state.productSlice.products)
  const orderProductIds = orderProducts.map(item => item.product._id)
  const notOrderedProducts = products.filter((product: ProductType) => !orderProductIds.some(id => product?._id === id))

  const addNewProductToOrder = (id: string) => {
    const addedProduct = notOrderedProducts.find(product => product._id === id)
    console.log(addedProduct)
    addedProduct && setOrderProducts(prev => [...prev, {product: addedProduct, productQuantity: 1}])
  }

return (
  <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
    <ModalHeader toggle={() => setShowModal(!showModal)}>Add Product</ModalHeader>
    <ModalBody>
      {notOrderedProducts.map(product => 
        <div className='order-product-modal-item'>
          <img src={product.image} className="admin-productImg"/>
          <div className='order-product-modal-title'>{product.title}</div>
          <AddIcon 
          className='order-product-modal-icon'
          onClick={() => product?._id && addNewProductToOrder(product?._id)}
          />
        </div>
      )}
    </ModalBody>
  </Modal>
)}

export default OrderModal