const useCart = () => {
  const cart = useState('cart', () => {
    return {
      items: [],
      customer: {
        shippingAddresses: [],
        phones: [],
      },
      paymentMethod: 'stripe',
      coupons: [],
      taxes: 0,
    }
  })

  const updateLocalStorage = () => {
    if (process.client) {
      localStorage.setItem('cart', JSON.stringify(cart.value))
    }
  }

  const addItem = (item, quantity) => {
    console.log('ITEM', item, quantity)
    console.log('CCC', [...cart.value.items])
    if (isNaN(quantity) || quantity === null) return
    let index = null
    index = cart.value.items.findIndex((p) => p.product == item._id)
    if (index !== -1) {
      cart.value.items[index].quantity = cart.value.items[index].quantity + quantity
    } else {
      const cartItem = {
        product: item._id,
        productType: item.productType,
        name: item.name,
        slug: item.slug,
        categories: item.categories,
        quantity: quantity * 1,
        thumb: item.gallery[0],
      }
      if (item.productType === 'simple') {
        cartItem.price = item.price
        cartItem.salePrice = item.salePrice
      }
      cart.value.items.push(cartItem)
    }
    updateLocalStorage()
  }

  const updateItemQuantity = (item, quantity) => {
    // console.log(item, quantity)
    if (isNaN(quantity) || quantity === null) return
    const index = cart.value.items.findIndex((p) => p.product == item.product)
    if (index !== -1) {
      if (quantity === 0) cart.value.items.splice(index, 1)
      else cart.value.items[index].quantity = quantity * 1
      updateLocalStorage()
    }
  }

  const updateCartCustomer = (customer = {}) => {
    cart.value.customer = customer
    updateLocalStorage()
  }

  const numberOfItems = () => {
    return cart.value.items.length ? cart.value.items.reduce((accumulator, item) => accumulator + item.quantity, 0) : 0
  }

  const cartTotal = () => {
    return cart.value.items.reduce((accumulator, item) => accumulator + item.price * item.quantity * 1, 0)
  }

  return { cart, addItem, numberOfItems, updateItemQuantity, updateCartCustomer, cartTotal }
}

export default useCart
