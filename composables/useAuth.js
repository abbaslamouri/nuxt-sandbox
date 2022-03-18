const useAuth = () => {
  const user = useState('user', () =>
    useCookie('auth').value && useCookie('auth').value.user ? useCookie('auth').value.user : {}
  )
  const token = useState('token', () =>
    useCookie('auth').value && useCookie('auth').value.token ? useCookie('auth').value.token : null
  )

  const isAuthenticated = useState('isAuthenticated', () => (token.value ? true : false))

  const isAdmin = useState('isAdmin', () => (user.value && user.value.role === 'admin' ? true : false))

  const login = async (user) => {
    console.log('here')
    try {
      const response = await $fetch('/api/v1/auth/login', {
        method: 'POST',
        body: user,
      })
      console.log(response)
      // user.value = response.user
      // token.value = response.token
      return response
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
  }
  const logout = async () => {
    try {
      await $fetch('/api/v1/auth/logout')
      // user.value = null
      // token.value = null
      return true
    } catch (error) {
      return { ok: false, errorMsg: error.data }
    }
    // await auth.logout()
    // showProfileDropdown.value = false
  }

  return { user, token, login, logout, isAuthenticated, isAdmin }
}

export default useAuth
