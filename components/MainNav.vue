<script setup>
const navLinkItems = ref([
  {
    title: 'Coffee',
    icon: 'IconsCoffee',
    show: false,
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
    show: false,
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
    show: false,
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
    show: false,
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
    show: false,
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
    show: false,
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
</script>

<template>
  <div class="main-nav">
    <ul class="items">
      <li
        class="item"
        v-for="(item, index) in navLinkItems"
        :key="item.title"
        @mouseenter="navLinkItems[index].show = true"
        @mouseleave="navLinkItems[index].show = false"
      >
        <div class="menu-item">
          <component :is="item.icon"></component>
          <div>{{ item.title }}</div>
        </div>

        <transition name="dropdown">
          <ul class="submenu shadow-md" v-show="item.show">
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
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.main-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: $slate-800;

  .items {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 996px;

    .item {
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
      }

      .submenu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        color: $slate-800;
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
      }
    }
  }
}
</style>
