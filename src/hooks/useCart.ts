import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/cart';
import { selectCartItems, selectCartTotal, selectCartItemCount, selectCartIsEmpty } from '../store/selectors';
import type { RootState, AppDispatch } from '../store';
import type { Product } from '../store/cart';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Cart state
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isEmpty = useSelector(selectCartIsEmpty);
  
  // Cart actions
  const add = (product: Product) => {
    dispatch(addToCart(product));
  };
  
  const remove = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };
  
  const updateQty = (id: string | number, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };
  
  const clear = () => {
    dispatch(clearCart());
  };
  
  // Helper functions
  const getItemQuantity = (productId: string | number): number => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };
  
  const isInCart = (productId: string | number): boolean => {
    return items.some(item => item.id === productId);
  };
  
  return {
    // State
    items,
    total,
    itemCount,
    isEmpty,
    
    // Actions
    add,
    remove,
    updateQty,
    clear,
    
    // Helpers
    getItemQuantity,
    isInCart,
  };
};

export default useCart;
