<script setup>
const navLinkItems = ref([
  {
    title: 'Coffee',
    icon: 'IconsCoffee',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'coffee-OLVL-480x480.webp',
        link: { title: 'Shop Original Coffee', page: 'original-coffee-pods' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
  {
    title: 'Machines',
    icon: 'IconsCoffeeMaker',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'Machines-All-02.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
  {
    title: 'Accessories',
    icon: 'IconsAccessories',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'coffee-OLVL-480x480.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
  {
    title: 'Recycling',
    icon: 'IconsRecycling',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'coffee-OLVL-480x480.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
  {
    title: 'Sustainability',
    icon: 'IconsSustainability',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'coffee-OLVL-480x480.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
  {
    title: 'Store Locator',
    icon: 'IconsLocationPin',
    open: false,
    subMenu: [
      {
        title: 'Coffee',
        image: 'coffee-OLVL-480x480.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Barista Creations',
        image: 'nav-caramel.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: 'Capsule Recycling',
        image: 'caps-rec.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
      {
        title: '',
        content: 'Hello World',
        image: '2nav-coffee-reedem10.webp',
        link: { title: 'Shop Original Coffee', page: 'index' },
      },
    ],
  },
])
// const router= useRouter()
// console.log(router.getRoutes())
// import { useError } from '~/pinia/useError'
// const appError = useError()

// const myError = computed(() => appError.snackbar)

// watchEffect(async () => {
//   console.log('PPPP', error.snackbar.show)
//   console.log('PPPP', error.snackbar.message)
//   if (error.snackbar.show) {
//     snackbar.show = true
//     snackbar.message = error.snackbar.message
//     snackbar.duration = 30
//     // } else if (categoryErrorMsg.value) {
//     //   snackbar.show = true
//     //   snackbar.message = categoryErrorMsg.value
//     //   snackbar.duration = 30
//     // } else {
//   } else {
//     snackbar.show = false
//     snackbar.message = ''
//     snackbar.duration = 0
//   }
// })

const enter = (el) => {
  // setTimeout(() => {
  //   //
  // }, 100)
  el.style.height = 'auto'
  const height = getComputedStyle(el).height
  el.style.height = 0
  getComputedStyle(el)
  setTimeout(() => {
    el.style.height = height
  })
  // setTimeout(() => {
  //   //
  // }, 100)
}

const leave = (el) => {
  // setTimeout(() => {
  // }, 100)
  el.style.height = getComputedStyle(el).height
  getComputedStyle(el)
  setTimeout(() => {
    el.style.height = 0
  })
  // setTimeout(() => {}, 100)
}

const afterEnter = (el) => {
  el.style.height = 'auto'
}
</script>

<template>
  <div class="main-nav">
    <ul class="items">
      <li
        class="item"
        v-for="(item, i) in navLinkItems"
        :key="item.title"
        @mouseenter="item.open = !item.open"
        @mouseleave="item.open = !item.open"
      >
        <div class="menu-item">
          <component :is="item.icon"></component>
          <div>{{ item.title }}</div>
        </div>
        <transition name="dropdown" @enter="enter" @after-enter="afterEnter" @leave="leave">
          <ul class="submenu shadow-md" v-show="item.open">
            <li class="submenu-item" v-for="subItem in item.subMenu" :key="subItem.title">
              <NuxtLink class="link" :to="{ name: `${subItem.link.page}` }">
                <div>{{ subItem.title }}</div>
                <img class="" :src="`/assets/${subItem.image}`" alt="" />
                <div>{{ subItem.link.title }}</div>
              </NuxtLink>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </div>

  <!-- {{ snackbar }} -->
  <!-- <div class="branding">
			<NuxtLink :to="{ name: `index` }"><img src="/yrl-logo.png" alt="" /></NuxtLink>
		</div> -->
  <!-- <ul> -->
  <!-- <NuxtLink class="link" :to="{ name: 'index' }"><span>Home</span></NuxtLink>
    <NuxtLink class="link" :to="{ name: 'admin' }"><span>Admin</span></NuxtLink>
    <NuxtLink class="link" :to="{ name: 'products' }"><span>Shop</span></NuxtLink>
    <NuxtLink class="link" to="#"><span>Categories</span> </NuxtLink> -->
  <!-- <NuxtLink class="link" :to="{ name: 'blog' }">Blog</NuxtLink> -->
  <!-- <NuxtLink class="link" :to="{ name: `admin-media-folder`, params: { folder: `all` } }">
				<span>Media</span>
			</NuxtLink> -->
  <!-- </ul> -->

  <!-- <SnackBar
      :show="myError.show"
      :message="myError.message"
      :snackbarType="myError.type"
      :duration="myError.duration"
      @hideSnackbar="myError.show = false"
    /> -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main-nav {
  display: flex;
  justify-content: center;
  // border: 1px solid teal;
  width: 100%;
  background-color: $slate-800;

  // margin: 0 auto;

  .items {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
    // border: 1px solid red;
    width: 996px;

    .item {
      // border: 1px solid teal;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: $slate-50;
      border-left: 1px solid $slate-600;
      border-right: 1px solid $slate-600;
      margin-right: -1px;
      cursor: pointer;

      &:hover {
        background-color: white;
        color: $slate-800;

        svg {
          fill: $slate-800;
        }
      }

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        text-transform: uppercase;
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1rem;

        svg {
          fill: $slate-50;
        }

        // px-20 py-2 border-x border-x-gray-600 hover:bg-white hover:text-slate-600 hover:shadow-lg cursor-pointer -ml-[1px]
      }

      .submenu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        color: $slate-800;
        // border:10px solid teal;
        // grid-template-rows: 1fr;
        // width: 100%;
        // z-index: 9999;
        background-color: white;

        .submenu-item {
          border: 1px solid $slate-200;
          border-top: none;
          .link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: 2rem;
          }

          // display: flex;
          // grid-row: 1 / 2;
          // grid-column: span 1;

          img {
            width: 50%;
            height: 50%;
            object-fit: contain;
          }

          &:last-child {
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
        }
        // border-x shadow-md border-x-gray-200 h-48 flex justify-center items-center overflow-hidden

        // grid grid-cols-4 bg-white absolute inset-x-0 top-full text-gray-800 overflow-hidden
      }
    }
  }
}

svg {
  width: 2rem;
}

//  w-[1024px] mx-auto flex items-center justify-center relative

// .submenu-item {
//   &:last-child {
//     a {
//       img {
//         width: 100%;
//         // height: 100%;
//         // object-fit: cover;
//       }
//     }
//   }
// }

// .main-nav {
//   display: flex;
//   align-items: center;

//   .branding {
//     display: flex;
//     align-items: center;

//     img {
//       width: 3rem;
//       margin-right: 1rem;
//     }
//   }

//   .link {
//     margin-right: 1rem;
//     cursor: pointer;
//     text-transform: uppercase;
//     font-weight: 500;
//     transition: 0.3s color ease-in-out;

//     &:hover {
//       color: #1eb8b8;
//     }
//   }
// }
</style>
