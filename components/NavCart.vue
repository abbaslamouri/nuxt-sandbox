<script setup>
import { useCart } from '~/pinia/useCart'

const cart = useCart()

onMounted(() => {
  if (process.client) {
    cart.cart = localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : {
          items: [],
          customer: { shippingAddress: {} },
          paymentMethod: 'stripe',
          coupons: [],
        }
  }
})
</script>

<template>
  <div class="nav-cart">
    <NuxtLink class="link" :to="{ name: 'cart' }">
      <IconsCartFill />
      <h3>Your bag</h3>
      <span class="badge">({{ cart.numberOfItems }})</span>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.nav-cart {
  display: flex;
  align-items: center;
  border: 1px solid $slate-50;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  height: 3rem;
  text-transform: uppercase;

  .link {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 300;

    h3 {
      text-transform: uppercase;
      font-weight: 300;
      font-size: 1.2rem;
    }

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  // border border-white flex items-center gap-2 rounded px-3 py-1
}
// .profile-nav {
// 	// padding: 1rem 2rem;
// 	// box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
// 	font-size: 1.2rem;
// 	text-transform: uppercase;
// 	display: flex;
// 	// justify-content: flex-end;
// 	gap: 1rem;

// 	.cart {
// 		a {
// 			display: flex;
// 			align-items: center;

// 			.badge {
// 				display: flex;
// 				align-items: center;
// 				justify-content: center;
// 				background-color: #f02020;
// 				color: #fff;
// 				border-radius: 50%;
// 				width: 2.5rem;
// 				height: 2.5rem;
// 				// padding: 0.3rem 0.7rem;
// 				font-size: 1.4rem;
// 				align-self: flex-start;
// 			}
// 		}
// 	}

// 	.nav-links {
// 		display: flex;
// 		align-items: center;
// 		justify-content: flex-end;
// 		gap: 2rem;

// 		.link {
// 			display: flex;
// 			align-items: center;
// 			gap: 0.3rem;

// 			svg {
// 				width: 1.5rem;
// 			}

// 			&.router-link-active {
// 				color: green;
// 			}
// 		}

// 		.nav-user {
// 			display: flex;
// 			align-items: center;
// 			gap: 1rem;
// 			margin-left: 2rem;

// 			img {
// 				border-radius: 50%;
// 				width: 3rem;
// 			}
// 		}
// 	}
// }
</style>
