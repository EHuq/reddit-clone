<template>
  <div>
    <p>{{$route.params.post_id}}</p>
    <div>{{post.title}}</div>
    <div></div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions, mapGetters } from 'vuex';
/* eslint-enable */

export default {
  mounted() {
    this.initPost(this.$route.params.post_id);
    this.initUsers();
  },
  watch: {
    '$route.params.name': function () {
      this.initPost(this.$route.params.name);
    },
    // post() {
    //   if (this.post.id) {
    //     this.initPosts(this.post.id);
    //   }
    // },
  },
  computed: {
    //   ...mapState('subreddit', ['posts']),
    ...mapState('post', ['posts']),
    ...mapGetters('post', ['post']),
    // ...mapState('auth', ['isLoggedIn', 'user']),
    // ...mapGetters('users', ['usersById']),
    loadedUsersById() {
      return this.posts.reduce((byId, post) => {
        /* eslint-disable */
        byId[post.user_id] = this.usersById[post.user_id] || {
          name: 'Loading',
        };
        /* eslint-disable */
        return byId;
      }, {});
    },
  },
  methods: {
    ...mapActions('post', ['initPost']),
    ...mapActions('users', { initUsers: 'init' }),

    // sort() {
    //   if (this.sortOption === 'top') {
    //     // this.slides.sort(this.sortAlphaNum)
    //   } else if (this.sortOption === 'new') {
    //     this.sortByDate();
    //   } else if (this.sortOption === 'hot') {
    //     this.hot();
    //   }
    // },
    // sortByDate() {
    //   return this.posts
    //     .sort((a, b) => a.created_at.toDate() - b.created_at.toDate())
    //     .reverse();
    // },
    // hot() {
    //   return this.posts;
    // },
  },
};
</script>
