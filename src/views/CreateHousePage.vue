<template>
  <page-layout>
    <section class="py-4 bg-teal-dark">
      <div class="container">
        <form class="form">
          <div class="form__field relative">
            <i class="input-icon material-icons absolute text-grey-darker">search</i>
            <input class="input__search" id="where" type="text" placeholder="Mexico City, Mexico" />
          </div>
        </form>
      </div>
    </section>

    <section class="section__create py-6">
      <div class="container">
        <h1 class="text-3xl mb-4">Publish a new room</h1>
        <form @submit.prevent="savePublication">
          <div class="mb-4">
            <label for="" class="input__label">Title</label>
            <input
              v-model="publication.title"
              class="input__field"
              placeholder="Titulo"
              type="text"
            />
          </div>
          <div class="mb-4">
            <label for="" class="input__label">Description</label>
            <textarea
              v-model="publication.description"
              class="input__field"
              rows="10"
              placeholder="Titulo"
            ></textarea>
          </div>
          <div class="mb-4">
            <label for="" class="input__label">Services</label>
            <check-box
              v-for="service in services"
              :key="service['.key']"
              :label="service.name"
              :identity="service['.key']"
              @changed="checked"
            ></check-box>
          </div>
          <div class="mb-4">
            <label for="" class="input__label">Featured Image</label>
            <input
              v-model="publication.featured_image"
              class="input__field"
              placeholder="URL"
              type="text"
            />
          </div>
          <div class="mb-4 text-right">
            <button
              type="submit"
              class="w-full bg-yellow-dark text-yellow-darker font-semibold py-3 px-6 rounded"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </section>
  </page-layout>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import { mapGetters } from 'vuex'
import PageLayout from '@/layouts/PageLayout.vue'
import CheckBox from '@/components/CheckBox.vue'

export default {
  name: 'CreateHousePage',
  beforeCreate() {
    this.$store.dispatch('FETCH_SERVICES')
  },
  data() {
    return {
      publication: {
        title: '',
        description: '',
        featured_image: '',
        services: {},
      },
    }
  },
  computed: {
    ...mapGetters(['services']),
  },
  components: {
    PageLayout,
    CheckBox,
  },
  methods: {
    savePublication() {
      const { title, description, featured_image, services } = this.publication
      const room = {
        title,
        description,
        featured_image,
        services,
        publishedAt: Date.now(),
      }
      this.$store.dispatch('CREATE_ROOM', room).then(() => {
        this.$router.push({ name: 'SearchPage' })
      })
    },
    checked($event) {
      if ($event.checked) {
        this.publication.services[$event.id] = $event.id
      } else {
        delete this.publication.services[$event.id]
      }
    },
  },
}
</script>
