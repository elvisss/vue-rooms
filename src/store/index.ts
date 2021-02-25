import { createStore } from 'vuex'
import firebase from 'firebase/app'
import { countObjectProperties } from '../utils'

export default createStore({
  state: {
    users: {},
    services: {},
    rooms: {},
    authId: null,
    modals: {
      login: false,
      register: false,
    },
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }: { name: string; value: boolean }) => {
      // @ts-ignore
      state.modals[name] = value
    },
    SET_ROOM(state, { newRoom, roomId }) {
      state.rooms = { ...state.rooms, roomId, newRoom }
    },
    APPEND_ROOM_TO_USER(state, { roomId, userId }) {
      // @ts-ignore
      state.users[userId].rooms = { ...state.users[userId].rooms, roomId }
    },
    SET_ITEM(state, { item, id, resource }) {
      const newItem = item
      newItem['.key'] = id
      // @ts-ignore
      state[resource] = { ...state[resource], [id]: newItem }
    },
    SET_AUTH_ID(state, id) {
      state.authId = id
    },
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value })
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room
      const roomId = firebase
        .database()
        .ref('rooms')
        .push().key
      newRoom.userId = state.authId
      newRoom.publishedAt = Math.floor(Date.now() / 1000)
      newRoom.meta = {
        likes: 0,
      }

      const updates = {}
      // @ts-ignore
      updates[`rooms/${roomId}`] = newRoom
      // @ts-ignore
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit('SET_ROOM', { newRoom, roomId })
          commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId })
          // @ts-ignore
          return Promise.resolve(state.rooms[roomId])
        })
    },
    FETCH_ROOMS: ({ state, commit }, limit) =>
      new Promise(resolve => {
        const roomsRef = firebase.database().ref('rooms')
        if (limit) {
          roomsRef.limitToFirst(limit).once('value', snapshot => {
            const rooms = snapshot.val()
            Object.keys(rooms).forEach(roomId => {
              const room = rooms[roomId]
              commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room })
            })
            resolve(Object.values(state.rooms))
          })
        } else {
          roomsRef.once('value', snapshot => {
            const rooms = snapshot.val()
            Object.keys(rooms).forEach(roomId => {
              const room = rooms[roomId]
              commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room })
            })
            resolve(Object.values(state.rooms))
          })
        }
      }),
    FETCH_USER: ({ state, commit }, { id }) =>
      new Promise(resolve => {
        firebase
          .database()
          .ref('users')
          .child(id)
          .once('value', (snapshot: any) => {
            commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() })
            // @ts-ignore
            resolve(state.users[id])
          })
      }),
    FETCH_SERVICES: ({ state, commit }) =>
      new Promise((resolve, reject) => {
        firebase
          .database()
          .ref('services')
          .once(
            'value',
            snapshot => {
              const services = snapshot.val()
              Object.keys(services).forEach(serviceId => {
                const service = services[serviceId]
                commit('SET_ITEM', { resource: 'services', id: serviceId, item: service })
              })
              resolve(Object.values(state.services))
            },
            err => {
              reject(err)
            }
          )
      }),
    CREATE_USER: ({ state, commit }, { email, name, password }) =>
      new Promise((resolve, reject) => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(account => {
            if (account.user !== null) {
              const id = account.user.uid
              const registeredAt = Math.floor(Date.now() / 1000)
              const newUser = { email, name, registeredAt }
              firebase
                .database()
                .ref('users')
                .child(id)
                .set(newUser)
                .then(() => {
                  commit('SET_ITEM', { resource: 'users', id, item: newUser })
                  // @ts-ignore
                  resolve(state.users[id])
                })
            } else {
              reject('Unable to get user')
            }
          })
      }),
    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser?.uid
      if (userId) {
        return dispatch('FETCH_USER', { id: userId }).then(() => {
          commit('SET_AUTH_ID', userId)
        })
      }
    },
    SIGN_IN(_context, { email, password }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    LOG_OUT({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('SET_AUTH_ID', null)
        })
    },
  },
  getters: {
    modals: state => state.modals,
    authUser: state => {
      // @ts-ignore
      return (state.authId ? state.users[state.authId] : null)
    },
    rooms: state => state.rooms,
    userRoomsCount: state => (id: any) => {
      // @ts-ignore
      return countObjectProperties(state.users[id].rooms)
    },
    services: state => state.services,
  },
  modules: {},
})
