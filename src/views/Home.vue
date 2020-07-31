<template>
  <div class="home">
    <button class="btn">
      <!-- eslint-disable-next-line -->
      <router-link
        class="text"
        :to="{ name: 'subreddits', params: { name: 'subreddits' } }"
      >View Subreddits</router-link>
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'home',
  methods: mapActions('auth', ['login']),
};
</script>

<style scoped>
.home {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn {
  padding: 1em 2em 1em 2em;
  background-color: darkslateblue;
  border: 1px black;
  border-radius: 1em;
}
.btn:hover {
  cursor: pointer;
}
.text {
  font-weight: 500;
  color: bisque;
}
</style>
