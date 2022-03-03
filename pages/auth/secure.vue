<script setup>
import { useAuth } from '~/store/useAuth'
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'

const router = useRouter()

const auth = useAuth()
const cart = useCart()
const appMessage = useMessage()

const user = reactive({
  email: 'lamouri@genvac.com',
  password: 'adrar0714',
})

const signin = async () => {
  appMessage.errorMsg = null
  appMessage.successMsg = null
  try {
    let response = await $fetch('/api/v1/auth/login', {
      method: 'POST',
      body: user,
    })
    auth.user = response.user
    auth.token = response.token
    const dbCart = cart.cart
    dbCart.customer = { ...cart.cart.customer, ...response.user }
    dbCart.cartTotal = cart.total
    response = await $fetch('/api/v1/cart', {
      method: 'POST',
      body: dbCart,
    })
    console.log('RES', response)
  } catch (error) {
    appMessage.errorMsg = error.data
  }
  router.push({ name: 'checkout' })
}
</script>

<template>
  <div class="secure">
    <div class="content">
      <div class="returing-customer">
        <h3>I am a Returning Customers</h3>
        <form @submit.prevent="handleLogin" class="main">
          <FormsBaseInput type="email" label="Email" v-model="user.email" :required="true" />
          <FormsBaseInput type="password" label="Password" v-model="user.password" :required="true" />
          <button class="btn btn-secondary" @click="signin">Sign In <IconsChevronRight /></button>
          <NuxtLink class="link" :to="{ name: `auth-forgot-password` }">Forgot Password?</NuxtLink>
        </form>
      </div>
      <div class="new-customer">
        <h3>I am a New Customers</h3>
        <div class="main">
          <h4>Create a YRL account</h4>
          <p>and receive these great benefits</p>
          <div class="promos">
            <div class="welcom-gift promo">
              <IconsWelcomeGift />
              <p>Welcome</p>
              <p>Gift</p>
            </div>
            <div class="early-coffee-access promo">
              <IconsFirstClass />
              <p>Early Coffee</p>
              <p>Access</p>
            </div>
            <div class="exclusive-prmos promo">
              <IconsShoppingBag />
              <p>Exclusive</p>
              <p>Promotions</p>
            </div>
            <div class="express-checkout promo">
              <IconsShoppingCartCheckout />
              <p>Express</p>
              <p>Checkout</p>
            </div>
          </div>
          <div class="actions">
            <NuxtLink class="link btn btn-primary" :to="{ name: 'auth-signup' }">
              <span>Create an Accoun</span>
            </NuxtLink>
            <NuxtLink class="link btn btn-primary" :to="{ name: 'checkout' }">
              <span>Checkout as a guest</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
.secure {
  width: 100%;
  flex: 1;
  background-color: $slate-900;
  display: flex;
  justify-content: center;

  .content {
    width: 996px;
    display: flex;
    align-items: flex-start;
    gap: 2rem;

    .returing-customer {
      flex: 1;
      // padding: 2rem;
      background-color: $slate-50;
      height: 300px;
      margin-top: 4rem;

      h3 {
        background-color: $stone-200;
        padding: 1rem 2rem;
        text-transform: uppercase;
        font-size: 1.4rem;
        letter-spacing: 0.1rem;
      }

      .main {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;

        .btn {
          align-self: flex-start;
          border-radius: 3px;
          padding: 1rem 2rem;
          display: flex;
          gap: 2rem;
        }

        .link {
          align-self: flex-start;
          color: $yellow-600;
          display: inline-block;
          font-size: 1.4rem;
        }
      }
    }

    .new-customer {
      flex: 1;
      // padding: 2rem;
      background-color: $slate-50;
      height: 300px;
      margin-top: 4rem;

      h3 {
        background-color: $stone-200;
        padding: 1rem 2rem;
        text-transform: uppercase;
        font-size: 1.4rem;
        letter-spacing: 0.1rem;
      }

      .main {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        .promos {
          display: flex;
          width: 100%;
          justify-content: space-evenly;
          margin: 3rem 0;

          .promo {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            font-weight: 700;
            // border: 1px solid red;

            p {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .actions {
        align-self: flex-end;
        .btn {
          align-self: flex-start;
          border-radius: 3px;
          padding: 1rem 2rem;
          display: flex;
          background-color: $green-700;
          color: $slate-50;
          gap: 2rem;
        }
      }
    }
  }
}
</style>
