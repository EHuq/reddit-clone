<template>
  <div>
    <aside class="menu">
      <p class="menu-label">
        Subreddits
      </p>
      <ul class="menu-list">
        <li v-for="subreddit in subreddits" :key="subreddit.Id">
          <router-link :to="{ name: 'subreddit', params: { name: subreddit.name } }">{{
            subreddit.name
          }}</router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  mounted() {
    this.init();
  },
  computed: mapState('subreddits', ['subreddits']),
  methods: mapActions('subreddits', ['init']),
};
</script>
