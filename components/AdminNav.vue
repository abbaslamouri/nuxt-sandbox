<script setup>
	const navLinks = ref([
		{ name: 'admin', title: 'Dashboard', icon: 'IconsHomeFill', subMenu: [], open: false },
		{ name: 'admin-media', title: 'Media', icon: 'IconsFolderFill', subMenu: [], open: false },
		{
			name: 'admin-ecommerce-products',
			title: 'Products',
			icon: 'IconsCartFill',
			subMenu: [
				{ name: 'admin-ecommerce-products', title: 'Products', icon: 'IconsCartFill' },
				{ name: 'admin-ecommerce-products-categories', title: 'Categories', icon: 'IconsClipboard' },
				{ name: 'admin-ecommerce-products-attributes', title: 'Attributes', icon: 'IconsIdentification' },
				{ name: 'admin-ecommerce-products-atributes', title: 'Coupons', icon: 'IconsCartFill' },
			],
			open: false,
		},
	])

	// import FolderFill from './icons/FolderFill.vue'
	// const router = useRouter()
	// // console.log(router.getRoutes())

	// const user = ref('')
	// const avatar = ref('')

	// // const user = computed(() => useState('user').value)
	// // const avatar = computed(() => useState('avatar').value)

	// const mobile = ref(false)
	// const sideNav = ref(true)
	// const showAdminNav = ref(false)
	// // const windowWidth = ref(null)

	// const checkWindowWidth = () => {
	// 	showAdminNav.value = window.innerWidth <= 750 ? true : false
	// 	// if (window.innerWidth <= 750) {
	// 	//   showAdminNav.value = true
	// 	// } else {
	// 	//   mobile.value = false
	// 	//   // sideNav.value = false
	// 	// }
	// }

	// onMounted(() => {
	// 	window.addEventListener('resize', checkWindowWidth)
	// 	checkWindowWidth()
	// })

	// const toggleSideNav = () => {
	// 	showAdminNav.value = !showAdminNav.value
	// }

	// window.location.assign('/admin/auth/login')
	// }
</script>

<template>
	<!-- <header> -->
	<!-- <transition name="admin-menu-slide"> -->
	<ul class="admin-menu">
		<li v-for="item in navLinks" :key="item.name" class="">
			<div class="link">
				<NuxtLink :to="{ name: item.subMenu ? `${item.name}` : 'admin' }">
					<component :is="item.icon"></component>
					<p>{{ item.title }}</p>
				</NuxtLink>
				<div class="chevron" v-if="item.subMenu.length > 0" @click="item.open = !item.open">
					<IconsChevronUp v-if="item.subMenu.length > 0 && item.open" />
					<IconsChevronDown v-else />
				</div>
			</div>
			<div v-if="item.subMenu.length > 0 && item.open === true">
				<ul class="admin-sub-menu">
					<li v-for="subItem in item.subMenu" :key="subItem.name">
						<NuxtLink :to="{ name: subItem.name }">
							<component :is="subItem.icon"></component>
							<p>{{ subItem.title }}</p>
						</NuxtLink>
					</li>
				</ul>
			</div>
			<!-- <a v-else href="#" class="link flex gap-2 px-6 py-2">
          <component :is="item.icon" class="w-[16px] h-[16px]"></component>
          <p>{{ item.title }}</p>
        </a> -->
		</li>
	</ul>
	<!-- </transition> -->

	<!-- <NuxtLink class="link" :to="{ name: 'admin' }"> <IconsHomeFill /><span>Dashboard</span> </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'admin-media' }"><IconsFolderFill /><span>Media</span></NuxtLink>

      <NuxtLink class="link" :to="{ name: 'admin-products' }"><IconsHomeFill /><span>Products</span> </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'admin-products-categories' }"
        ><IconsHomeFill /><span>Categories</span>
      </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'admin-products-attributes' }"
        ><IconsHomeFill /><span>Attributes</span>
      </NuxtLink>
      <NuxtLink class="link" :to="{ name: 'admin-products-coupons' }"><IconsHomeFill /><span>Coupons</span> </NuxtLink> -->
	<!-- <NuxtLink class="link" :to="{ name: 'admin-products-attributes' }"
          ><IconsHomeFill /><span>Attributes</span>
        </NuxtLink> -->

	<!-- <NuxtLink class="link" :to="{ name: 'blog' }"><IconsHomeFill /></NuxtLink>
      <NuxtLink class="link" :to="{ name: 'admin' }"
        ><IconsPersonFill /><span v-if="!showAdminNav">Admin</span></NuxtLink
      >
      <NuxtLink class="link" :to="{ name: 'admin-media-folder', params: { folder: 'all' } }"
        ><IconsCommonFill /><span v-if="!showAdminNav">Media</span></NuxtLink
      >
      <button class="link toggle" href="#" @click="toggleSideNav">
        <IconsArrowLeft v-if="!showAdminNav" />
        <IconsArrowRight v-else />
      </button> -->

	<!-- </header> -->
</template>

<style lang="scss" scoped>
	@import '@/assets/scss/variables';

	.admin-menu {
		font-size: 1.3rem;
		width: 100%;
		// border:1px solid red;

		svg {
			width: 1.5rem;
			height: 1.5rem;
			fill: $slate-50;
		}

		.link {
			display: flex;
			justify-content: space-between;
			align-items: center;
			a {
				display: flex;
				align-items: center;
				gap: 1rem;
			}

			.chevron {
				width: 2rem;
				height: 2rem;
				cursor: pointer;
				transition: all 1s ease;
			}
		}

		li {
			border-top: 1px solid $slate-400;
			transition: all 0.2s ease;
			// border-b border-b-gray-100 hover:bg-slate-100 hover:text-gray-900 hover:border-slate-800 transition duration-200
			a {
				display: flex;
				align-items: center;
				gap: 1rem;
				padding: 0.75rem 1rem;
				width: 100%;
				text-transform: uppercase;

				&:hover {
					background-color: $slate-200;
					color: $slate-800;
				}

				// link flex gap-2 px-6 py-2
			}

			&:first-child {
				border-top: none;
			}
		}
		.admin-sub-menu {
			font-size: 1.1rem;
			padding-left: 1rem;
			// display:flex;
			// align-items: center;
			// justify-content: space-between;

			svg {
				fill: white;
			}
			// bg-slate-800 text-slate-200
			li {
				&:last-child {
					border-bottom: 1px solid $slate-400;
				}
			}
		}
		//   border: 1px red solid;
		//   padding: 2rem 0;
		//   color: #fff;

		//   // width: 70%;
		//   // max-width: 15rem;
		//   display: flex;
		//   flex-direction: column;
		//   // position: fixed;
		//   // top: 0;
		//   // left: 0;
		//   height: 100%;
		//   background-color: #203040;
		//   font-size: 1.2rem;
		//   // transform: translateX(-25rem);

		//   .link {
		//     padding: 1rem 0;
		//     padding: 0.5rem 2rem;
		//     text-transform: uppercase;
		//     display: flex;
		//     align-items: center;
		//     gap: 1rem;

		//     svg {
		//       width: 2rem;
		//       fill: #fff;
		//     }

		//     &:hover {
		//       background-color: #fff;
		//       color: #303030;
		//     }

		//     &.toggle {
		//       justify-content: center;
		//       background-color: transparent;
		//       border: none;
		//       color: #fff;
		//       cursor: pointer;

		//       svg {
		//         width: 2rem;
		//       }
		//     }
		//   }
	}
</style>
