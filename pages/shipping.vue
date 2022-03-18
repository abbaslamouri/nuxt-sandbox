<script setup>
import { useCart } from '~/store/useCart'
import { useMessage } from '~/store/useMessage'
import countryData from '~/assets/countryData.json'
import stateData from '~/assets/stateData.json'

useMeta({
  title: 'Shipping | YRL',
})
definePageMeta({
  layout: 'checkout',
})

const router = useRouter()
const cart = useCart()
const appMessage = useMessage()
const { state, fetchAll } = useProduct()
const promoCode = ref(null)
const showSelectQtys = ref([])
const showAddressModalKeys = ref([])
const shippingOption = ref(null)
const shippingAddresses = ref(null)
const phones = ref(null)

const storeData = () => {
  shippingAddresses.value = JSON.stringify(cart.customer.shippingAddresses)
  phones.value = JSON.stringify(cart.customer.phones)
}

for (const prop in cart.customer.shippingAddresses) {
  showAddressModalKeys.value[prop] = false
}

const handleOkBtnClicked = (event, index) => {
  for (const prop in showSelectQtys.value) {
    showSelectQtys.value[prop] = false
  }
  showSelectQtys.value[index] = event.status
  cart.updateItemQuantity(cart.items[index], event.quantity)
}

const handleSubmit = async () => {
  // cart.updateCustomerInfo()
  // cart.updateCustomerInfo(cart.customer)
  await cart.saveCart()
  router.push({ name: 'payment' })
}

const handleEditAddressBtnClick = (i) => {
  for (const prop in cart.customer.shippingAddresses) {
    showAddressModalKeys.value[prop] = false
  }
  showAddressModalKeys.value[i] = true
  // cart.customer.value = cart.customer
  // console.log(cart.customer)
  // showAddressModal.value = true
}

const handleAddAddressBtnClick = () => {
  cart.customer.shippingAddresses.push({
    title: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    addressType: 'Residential',
    default: false,
    deliveryInstructions: '',
  })
  showAddressModalKeys.value[cart.customer.shippingAddresses.length - 1] = true

  cart.customer.phones.push({
    phoneType: '',
    phoneNumber: '',
    phoneCountryCode: '1',
  })

  // console.log(cart.customer)
  // showAddressModal.value = true
}

const handleAddPhoneNumberBtnClick = () => {
  if (cart.customer.phones.length >= 4) return (appMessage.errorMsg = 'You cannot enter more tghan 4 phone number')
  cart.customer.phones.push({
    phoneType: '',
    phoneNumber: '',
    phoneCountryCode: '1',
  })
}

const updateCustomerShippingAddress = (i) => {
  console.log(JSON.stringify(cart.customer.shippingAddresses) === shippingAddresses)
  console.log(JSON.stringify(cart.customer.phones) === phones)
  console.log(cart.customer.shippingAddresses)
  console.log(cart.customer.phones)
  storeData()
  showAddressModalKeys.value[i] = false
}

const cancelCustomerShippingAddress = (i) => {
  showAddressModalKeys.value[i] = true
  cart.customer.shippingAddresses = JSON.parse(shippingAddresses)
  cart.customer.phones = JSON.parse(phones)
}

const setDefaultAddress = (i) => {
  for (const prop in cart.customer.shippingAddresses) {
    cart.customer.shippingAddresses[prop].default = false
  }
  cart.customer.shippingAddresses[i].default = true
}

const handleRemovePhoneNumberBtnClick = (i) => {
  cart.customer.phones.splice(i, 1)
}

storeData()
</script>

<template>
  <div class="shipping">
    <div class="checkout-steps">
      <EcommerceCheckoutSteps :step="2" activeColor="#16a34a" />
    </div>
    <div class="content" v-if="cart.items.length">
      <div class="main">
        <!-- <pre>{{ cart.customer }}==={{ showAddressModalKeys }}</pre> -->
        <div class="shipping-address">
          <div class="header">Shipping Addresses</div>
          <div class="main">
            <div class="addresses" v-if="cart.customer.shippingAddresses">
              <div class="address" v-for="(address, i) in cart.customer.shippingAddresses" :key="`address-${i}`">
                <div class="default-status">
                  <!-- <p class="info">Currently set as your default address</p> -->
                  <FormsBaseRadio
                    v-model="cart.customer.shippingAddresses[i].default"
                    :value="true"
                    @update:modelValue="setDefaultAddress(i)"
                  />
                </div>
                <div class="details">
                  <div class="name">{{ address.name || cart.customer.name }}</div>
                  <div class="street">{{ address.address }}</div>
                  <div class="city-state-postalCode">
                    <span class="city">{{ address.city }}</span>
                    <span class="state">{{ address.state }}</span
                    >&nbsp;
                    <span class="postal-code">{{ address.postalCode }}</span>
                  </div>
                </div>
                <button class="btn btn-secondary edit-address" @click="handleEditAddressBtnClick(i)">
                  Edit Address
                </button>
                <Modal v-if="showAddressModalKeys[i]" :outerBoxWidth="75" :outerBoxHeight="100">
                  <template v-slot:header>
                    <h3>Address</h3>
                    <p>Mandatory fields are marked with a *</p>
                  </template>
                  <template v-slot:default>
                    <div class="shipping-address-popup-main">
                      {{ cart.customer }}
                      <section>
                        <div class="field-group">
                          <FormsBaseRadioGroup
                            label="My delivery address is"
                            v-model="cart.customer.shippingAddresses[i].addressType"
                            :options="[
                              { key: 'Residential', name: 'Residential' },
                              { key: 'Commercial', name: 'Commercial' },
                            ]"
                          />
                        </div>
                        <div class="field-group">
                          <FormsBaseSelect
                            label="Title"
                            v-model="cart.customer.shippingAddresses[i].title"
                            :options="[
                              { key: 'Mr/Ms', name: 'Mr/Ms' },
                              { key: 'Ms', name: 'Ms' },
                              { key: 'Mr', name: 'Mr' },
                              { key: 'Dr', name: 'Dr' },
                              { key: 'Mrs', name: 'Mrs' },
                              { key: '', name: '-' },
                            ]"
                          />
                          <FormsBaseInput
                            label="Name"
                            placeholder="Name"
                            v-model="cart.customer.shippingAddresses[i].name"
                          />
                        </div>
                        <div class="field-group"></div>
                      </section>
                      <section class="phone-numbers">
                        <div
                          class="field-group"
                          v-for="(phoneNumber, j) in cart.customer.phones"
                          :key="`phone-number-${j}`"
                        >
                          <div class="phone-number">
                            <FormsBaseInput
                              label="Phone Number"
                              placeholder="Phone Number"
                              v-model="cart.customer.phones[j].phoneNumber"
                            />
                          </div>
                          <div class="phone-type">
                            <FormsBaseSelect
                              label="PhoneType"
                              v-model="cart.customer.phones[j].phoneType"
                              :options="[
                                { key: 'Cell', name: 'Cell' },
                                { key: 'Home', name: 'Home' },
                                { key: 'Worrk', name: 'Mr' },
                              ]"
                            />
                          </div>

                          <div class="phone-country-code">
                            <FormsBaseSelect
                              label="Country Code"
                              v-model="cart.customer.phones[j].phoneCountryCode"
                              :options="
                                countryData.map((el) => {
                                  return { key: el.phone_code, name: el.country_name }
                                })
                              "
                            />
                          </div>

                          <button
                            class="btn btn-secondary remove-phone-number"
                            @click="handleRemovePhoneNumberBtnClick(i)"
                            v-if="cart.customer.phones.length > 1"
                          >
                            <IconsMinus />
                          </button>
                        </div>
                        <button
                          class="btn btn-secondary add-phone-number"
                          @click="handleAddPhoneNumberBtnClick"
                          :disabled="cart.customer.phones.length >= 4"
                        >
                          Add Phone Number
                        </button>
                      </section>
                      <section>
                        <FormsBaseInput
                          label="Address"
                          placeholder="Address"
                          v-model="cart.customer.shippingAddresses[i].address"
                        />
                        <div class="field-group">
                          <FormsBaseInput
                            label="City"
                            placeholder="City"
                            v-model="cart.customer.shippingAddresses[i].city"
                          />
                          <FormsBaseSelect
                            label="State"
                            v-model="cart.customer.shippingAddresses[i].state"
                            :options="
                              stateData.map((el) => {
                                return { key: el.abbreviation, name: el.name }
                              })
                            "
                          />
                        </div>
                        <div class="field-group">
                          <FormsBaseInput
                            label="Postal Code"
                            placeholder="Postal Code"
                            v-model="cart.customer.shippingAddresses[i].postalCode"
                          />
                          <FormsBaseSelect
                            label="Country"
                            v-model="cart.customer.shippingAddresses[i].country"
                            :options="
                              countryData.map((el) => {
                                return { key: el.three_letter_country_code, name: el.country_name }
                              })
                            "
                          />
                        </div>
                      </section>
                      <section class="delivery-instructions">
                        <div class="field-group">
                          <FormsBaseTextarea
                            label="Delivery Instructions"
                            rows="5"
                            v-model="cart.customer.shippingAddresses[i].deliveryInstructions"
                          />
                        </div>
                      </section>
                      <section>
                        <FormsBaseToggle
                          label="Set as the default delivery address"
                          v-model="cart.customer.shippingAddresses[i].default"
                          @update:modelValue="setDefaultAddress(i)"
                        />
                      </section>
                    </div>
                  </template>
                  <template v-slot:footer>
                    <section class="actions">
                      <button class="btn btn-secondary cancel" @click="cancelCustomerShippingAddress(i)">Cancel</button>
                      <button class="btn btn-primary" @click="updateCustomerShippingAddress(i)">Save Address</button>
                    </section>
                  </template>
                </Modal>
              </div>
            </div>

            <button class="btn btn-secondary add-address" @click="handleAddAddressBtnClick">Add Address</button>
          </div>
          <div class="customer-address"></div>
        </div>
        <div class="shipping-options">
          <div class="header">Shipping Options</div>
          <div class="main">
            <div class="deliveries">
              <div class="title">Home and Office Deliveries</div>
              <div class="option free">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="free" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Standard - Free (from $35)</div>
                  <div class="details">Arrives in 3 - 5 business days</div>
                </div>
                <div class="cost">Free</div>
              </div>
              <div class="option paid">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="paid" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Standard - Paid (from $34.99)</div>
                  <div class="details">Arrives in 1 - 3 business days</div>
                </div>
                <div class="cost">$6.95</div>
              </div>
            </div>
            <div class="pickup">
              <div class="title">Pickup</div>
              <div class="option free">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="fedexUps" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">Pick Up Point (FedEx or UPS)</div>
                  <div class="details">Arrives in 1 - 3 business days</div>
                  <button class="btn btn-secondary learn-more">Learn More <IconsChevronRight /></button>
                </div>
                <div class="cost">Free</div>
              </div>
              <div class="option paid">
                <div class="radio-button">
                  <FormsBaseRadio v-model="shippingOption" value="Boutique" />
                </div>
                <IconsFree />
                <div class="content">
                  <div class="title">YRL Boutique</div>
                  <div class="details">Immediate. Buy online, pick up in store</div>
                  <div class="learn-more">
                    Ready in-store 2 hours after your order is placed online. Order will be held until store closing the
                    following day. Unclaimed orders will be canceled and refunded 24 hours after purchase.
                  </div>
                </div>
                <div class="cost">$6.95</div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <NuxtLink class="link btn btn-primary back" :to="{ name: 'checkout' }">
            <IconsChevronLeft /><span>Back to Basket</span>
          </NuxtLink>
          <NuxtLink class="link btn btn-primary" :to="{ name: 'payment' }">
            <span> continue</span><IconsChevronRight />
          </NuxtLink>
        </div>
      </div>
      <div class="aside">
        <div class="intro">Shopping Bag</div>
        <div class="table shipping-shopping-bag">
          <div class="table__header">
            <div class="row">
              <div class="th">Item</div>
              <div class="th">Quantity</div>
              <div class="th">Total</div>
            </div>
          </div>
          <div class="table__body">
            <div class="row" v-for="(item, index) in cart.items" :key="item.product">
              <div class="image-name td">
                <h4 class="name">{{ item.name }}</h4>
              </div>
              <div class="quantity td">{{ item.quantity }}</div>
              <div class="line-item-total td">${{ (item.quantity * item.price).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        <div class="total">
          <div class="cart-subtotal row">
            <span> Subtotal</span><span class="currency">${{ cart.total.toFixed(2) }}</span>
          </div>
          <div class="cart-taxes row">
            <span> Estimated Taxes</span>
            <span v-if="cart.taxes" class="currency">${{ cart.taxes.toFixed(2) }}</span>
            <span v-else class="currency">$0.00</span>
          </div>
          <div class="cart-total row">
            <span> Total</span>
            <span v-if="cart.taxes" class="currency">${{ (cart.total + cart.taxes).toFixed }}</span>
            <span v-else class="currency">${{ cart.total.toFixed(2) }}</span>
          </div>
        </div>
        <div class="footer">
          <NuxtLink class="link btn btn-primary" :to="{ name: 'checkout' }">
            <span>Edit</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="empty-cart">
      <p>You have no items in your bag</p>
      <NuxtLink class="link btn btn-primary" :to="{ name: 'ecommerce-products' }">
        <span>Start Shopping</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.shipping {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $slate-900;
  width: 100%;

  .checkout-steps {
    width: 996px;
    color: $slate-50;
    background-color: $slate-700;
  }

  .content {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    width: 996px;

    .main {
      width: 655px;
      background-color: $slate-50;

      .shipping-address {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .header {
          background-color: $stone-400;
          padding: 2rem;
          color: $slate-50;
          text-transform: uppercase;
        }

        .main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem;

          .addresses {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            // align-items: center;
            .address {
              display: flex;
              align-items: center;
              // flex-direction: column;
              gap: 3rem;
              font-size: 1.2rem;
              font-weight: 700;

              .default-status {
              }

              .details {
                display: flex;
                flex-direction: column;
                // align-items: center;
              }
              .edit-address {
                display: flex;
                align-items: center;
                color: $yellow-700;
                border: none;
                padding: 0;
              }
            }
          }

          .info {
            color: $stone-500;
            font-size: 1.2rem;
          }

          .btn {
            border-radius: 3px;

            // &.edit-address {
            //   color: $yellow-700;
            //   border: none;
            //   align-self: flex-start;
            //   padding: 0;
            // }

            &.add-address {
              align-self: flex-end;
              padding: 1rem 2rem;
            }
          }
        }
      }

      .shipping-options {
        font-size: 1.2rem;
        .header {
          background-color: $stone-400;
          padding: 2rem;
          color: $slate-50;
          text-transform: uppercase;
        }

        .main {
          .deliveries,
          .pickup {
            .title {
              background-color: $stone-300;
              padding: 1rem 2rem;
            }

            .option {
              padding: 1rem 2rem;
              display: flex;
              align-items: center;
              gap: 2rem;

              svg {
                width: 5rem;
                height: 5rem;
              }

              .content {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;

                .title {
                  background-color: transparent;
                  padding: 0;
                  font-size: 1.4rem;
                  font-weight: 600;
                }

                .details {
                  color: $stone-600;
                }

                .btn {
                  padding: 0;
                  border: none;
                  height: fit-content;
                  color: $yellow-700;
                  text-transform: capitalize;

                  svg {
                    width: 1.5rem;
                    height: 1.5rem;
                  }
                }
              }

              .cost {
                color: $yellow-700;
              }
            }
          }
        }
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem;
        display: flex;

        .btn {
          gap: 2rem;
          padding: 1rem 3rem;
          border-radius: 3px;
          background-color: $green-700;

          &.back {
            padding: 1rem 2rem;
            color: $yellow-700;
            background-color: transparent;
            border: none;

            svg {
              fill: $yellow-700;
            }
          }

          svg {
            fill: $slate-50;
          }
        }
      }
    }
    .aside {
      background-color: $slate-50;
      width: 320px;
      max-width: 320px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 415px;

      .intro {
        text-align: center;
        font-weight: 700;
        letter-spacing: 0.15rem;
      }

      .table.shipping-shopping-bag {
        border: 1px solid $stone-300;

        .table__header {
          padding: 1rem;
          background-color: $stone-300;
        }
        .table__body {
          padding: 0 1rem;
          .row {
            border: none;
            border-bottom: 1px solid $stone-200;
            padding: 0.75rem 0;

            .name {
              font-weight: 600;
            }

            .line-item-total {
              color: $yellow-700;
              font-size: 1.2rem;
            }
          }
        }
      }

      .total {
        padding: 0 2rem;
        font-size: 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .currency {
            color: $yellow-700;
          }
        }
      }
      .footer {
        .btn {
          padding: 1rem 3rem;
          border-radius: 3px;
          background-color: transparent;
          color: $slate-800;
        }
      }
    }
  }
}

.shipping-address-popup-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  // font-size: 1.2rem;
  // font-weight: 700;

  .phone-numbers {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .field-group {
      display: flex;
      // flex-direction: row;
      // grid-template-rows: 1fr;
      // grid-template-columns: 1fr 20% 20% 2rem;
      align-items: center;
      gap: 2rem;
      width: 100%;
      border: 1px solid green;

      .phone-number {
        flex: 1;
      }

      .phone-type {
        width: 20rem;
      }

      .phone-country-code {
        width: 20rem;
      }

      .remove-phone-number {
        padding: 1rem;
        display: flex;
        align-items: center;
        align-self: center;
        border: none;

        svg {
          height: 3rem;
          width: 3rem;
          fill: red;
        }
      }
    }
    .btn {
      align-self: flex-end;

      &:disabled {
        cursor: not-allowed;
      }
    }
  }

  .field-group {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  // border: 1px solid $stone-400;
}

footer {
  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 2rem;

    .btn {
      padding: 1rem 3rem;
    }
  }
}
</style>
