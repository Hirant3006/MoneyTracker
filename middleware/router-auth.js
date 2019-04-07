export default function ({ store, redirect, route }) {
  console.log('Middleware ' , route)
  store.state.user != null && route.name == 'login' ? redirect('/admin') : ''
  store.state.user == null  ? redirect('/login') : ''
}

function isAdminRoute(route) {
  if (route.matched.some(record => record.path == '/admin')) {
    return true
  }
}
