export default defineNuxtRouteMiddleware((to, from) => {
	console.log(from)
	console.log(to)
	if (to.params.id) {
		return abortNavigation('A hell of an error')
	}
	return navigateTo({ name: 'admin-ecommerce-product-slug' })
})
