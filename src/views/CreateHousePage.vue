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
            <label for="" class="input__label">Featured Image</label>
            <input
              v-model="publication.featuredImage"
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
import PageLayout from '@/layouts/PageLayout.vue'

export default {
  name: 'CreateHousePage',
  data() {
    return {
      publication: {
        title: 'a',
        description: 'b',
        featuredImage: 'c',
      },
    }
  },
  components: { PageLayout },
  methods: {
    savePublication() {
      const { title, description, featuredImage } = this.publication
      const room = {
        title,
        description,
        featuredImage,
        publishedAt: Date.now(),
      }
      this.$store.dispatch('CREATE_ROOM', room)
    },
  },
}
</script>
