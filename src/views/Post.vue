<template>
  <div>
    <div class="post">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{post.title}}</p>
            <div class="user-date-block">
              <!-- eslint-disable  -->
              <p
                class="subtitle username"
              >Posted by {{loadedUsersById[post.user_id] ? loadedUsersById[post.user_id].name : 'Loading...'}}</p>
              <time class="subtitle" v-show="getCreated()">{{getCreated()}}</time>
              <!-- eslint-enable  -->
            </div>
          </div>
        </div>

        <div class="content" v-show="post.description">{{post.description}}</div>
        <figure v-show="post.url" class="img">
          <img :src="post.url" alt="img" />
        </figure>
      </div>
    </div>
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
      this.initPost(this.$route.params.post_id);
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
    ...mapGetters('users', ['usersById']),
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
    getCreated() {
      function timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
          return `${interval} years`;
        } else if (interval == 1) {
          return `${interval} year`;
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return `${interval} months`;
        } else if (interval == 1) {
          return `${interval} month`;
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return `${interval} days`;
        } else if (interval == 1) {
          return `${interval} day`;
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return `${interval} hours`;
        } else if (interval == 1) {
          return `${interval} hour`;
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return `${interval} minutes`;
        }
        return `${Math.floor(seconds)} seconds`;
      }
      try {
        const timeAgo =
          timeSince(this.post.created_at.seconds * 1000) < 0
            ? '0 seconds ago'
            : `${timeSince(this.post.created_at.seconds * 1000)} ago`;
        return timeAgo;
      } catch (error) {
        // console.error(error);
        return '0';
      }
    },
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
<style scoped>
.media-content {
  overflow: hidden !important;
}
.subtitle {
  font-size: 0.75em !important;
  line-height: auto !important;
  margin-bottom: 0 !important;
}
.user-date-block {
  display: flex;
  margin-top: -1em;
}
.username {
  margin-right: 1em;
}
.post {
  background-color: #ececec;
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.1);
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  color: #4a4a4a;
  max-width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 10em;
  max-height: 45em;
  overflow: hidden;
  margin: 1em 1em 1em 1em;
  border: #4a4a4a;
  border-radius: 0.75em;
}
.img {
  max-width: 575px;
  margin: auto;
  margin-top: 1em;
}
</style>
