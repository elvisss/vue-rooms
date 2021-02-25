import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const firebaseConfig = {
  apiKey: 'AIzaSyBmw15uhZXzIIsbKiYy5P95Z-BmrHh0Shs',
  authDomain: 'platzirooms-9575e.firebaseapp.com',
  databaseURL: 'https://platzirooms-9575e-default-rtdb.firebaseio.com',
  projectId: 'platzirooms-9575e',
  storageBucket: 'platzirooms-9575e.appspot.com',
  messagingSenderId: '932304267174',
  appId: '1:932304267174:web:33fd84cc51e90b029ad167',
}

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch('FETCH_AUTH_USER')
  }
})

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
