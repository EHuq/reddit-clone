<template>
  <div class="home">
    <!-- eslint-disable max-len -->
    <div class="allPosts">
      <div v-for="(post, i) in sortedPosts" :key="post.id">
        <div class="post">
          <div class="title-votes-container">
            <div v-show="votesLoaded(i)" class="votes-container">
              <button
                class="votes"
                :class="votesLoaded(i) && sortedPosts[i].votes[user.id] === 1 ? 'votesClicked' : ''"
                @click="onUpvotePost(post.id)"
              >&uarr;</button>
              <p v-show="post.score >= 0">{{sumVotes(sortedPosts[i].votes)}}</p>
              <p v-show="post.score < 0">0</p>
              <button
                class="votes"
                @click="onDownvotePost(post.id)"
                :class="votesLoaded(i) && sortedPosts[i].votes[user.id] === -1 ? 'votesClicked' : ''"
              >&darr;</button>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content is-clipped">
                  <p class="title is-4" v-show="!post.url">
                    <router-link
                      :to="{
                        name: 'post',
                        params: {
                          name: loadedSubredditsById[post.subreddit_id].name,
                          post_id: post.id,
                        }
                      }"
                    >{{post.title}}</router-link>
                  </p>
                  <p class="title is-4" v-show="post.url">
                    <a :href="post.url" target="_blank">{{post.title}}</a>
                  </p>
                  <div class="user-date-block">
                    <!-- eslint-disable -->
                    <p class="subtitle username">Posted by {{loadedUsersById[post.user_id].name}}</p>
                    <!-- eslint-enable -->
                    <time class="subtitle">{{getCreated(post)}}</time>
                  </div>
                </div>
              </div>

              <div v-show="post.description" class="description">
                <p>{{post.description}}</p>
              </div>
              <div class="card-image" v-show="isImage(post.url)">
                <div class="img-container">
                  <img :src="post.url" alt="img" class="img" />
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer bottom">
            <router-link
              :to="{
                name: 'post',
                params: {
                  name: loadedSubredditsById[post.subreddit_id].name,
                  post_id: post.id,
                }
              }"
              class="card-footer-item"
            >Comments</router-link>
            <!-- eslint-disable  -->
            <a
              @click="deletePost(post.id)"
              v-show="user && user.id == post.user_id"
              class="card-footer-item"
            >Delete</a>
            <!-- eslint-enable  -->
          </footer>
        </div>
      </div>
    </div>
    <div class="subreddit-list">
      <div class="menu">
        <p class="menu-label">Subreddits</p>
        <ul class="menu-list">
          <li v-for="subreddit in subreddits" :key="subreddit.Id">
            <router-link class="text" :to="{ name: 'subreddit', params: { name: subreddit.name } }">
              r/{{
              subreddit.name
              }}
            </router-link>
          </li>
        </ul>

        <router-link :to="{ name: 'subreddits', params: { name: 'subreddits' } }">
          <button class="btn">View All Subreddits</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  data: () => ({
    subredditNames: [],
  }),
  mounted() {
    this.init();
    this.initAll();
    this.initUsers();
  },
  watch: {
    '$route.params.name': function () {
      this.initSubreddit(this.$route.params.name);
    },
    subreddit() {
      if (this.subreddit.id) {
        this.initPosts(this.subreddit.Id);
      }
    },
  },
  computed: {
    ...mapState('subreddits', ['subreddits']),
    ...mapState('subreddit', ['posts']),
    ...mapState('auth', ['user']),
    ...mapGetters('users', ['usersById']),
    ...mapGetters('subreddits', ['subredditById']),
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
    loadedSubredditsById() {
      return this.posts.reduce((byId, post) => {
        /* eslint-disable */
        byId[post.subreddit_id] = this.subredditById[post.subreddit_id] || {
          name: 'Loading',
        };
        /* eslint-enable */
        return byId;
      }, {});
    },
    votesLoaded() {
      return (index) => {
        try {
          /* eslint-disable */

          return (
            this.posts[index].votes[this.user.id] ||
            this.posts[index].votes[this.user.id] === 0 ||
            this.posts[index].votes[this.user.id] === undefined

            /* eslint-enable */
          );
        } catch (error) {
          return false;
        }
      };
    },
    sortedPosts() {
      return this.posts
        .slice(0)
        .sort((a, b) => a.score - b.score)
        .reverse();
    },
  },
  methods: {
    ...mapActions('auth', ['login', 'isLoggedIn', 'user']),
    ...mapActions('subreddits', ['init', 'initSubreddit', 'loadSubreddit']),
    ...mapActions('subreddit', [
      'initAll',
      'initPosts',
      'deletePost',
      'postUpvote',
      'postDownvote',
    ]),
    ...mapActions('users', { initUsers: 'init' }),
    sumVotes(votes) {
      console.log('run');
      console.log(votes);
      return Object.keys(votes).reduce(
        (sum, key) => sum + parseFloat(votes[key] || 0),
        0,
      );
    },
    getSubredditName(index) {
      return this.subredditNames[index];
    },
    getCreated(post) {
      function timeSince(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) {
          return `${interval} years`;
          /* eslint-disable */
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
      return timeSince(post.created_at.seconds * 1000) < 0
        ? '0 seconds ago'
        : `${timeSince(post.created_at.seconds * 1000)} ago`;
    },
    isImage(url) {
      return url.match(/(png|jpg|jpeg|gif)/);
    },
    async onUpvotePost(post_id) {
      await this.postUpvote(post_id);
    },
    async onDownvotePost(post_id) {
      await this.postDownvote(post_id);
    },
    /* eslint-enable */
  },
};
</script>

<style scoped>
.allPosts {
  width: 100%;
  margin: 0.5em;
  margin-left: 1em;
  /* padding: 0.5em; */
}

.card-footer {
  margin-top: 1.25em;
}

.title-votes-container {
  display: flex;
  flex-direction: row;
}

.votes-container {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  text-align: center;
  margin-left: 1em;
  height: 7.75em;
}
.votesClicked {
  color: #ff3860;
  background-color: black;
}

.subtitle {
  font-size: 0.75em !important;
  line-height: auto !important;
  margin-bottom: 0 !important;
}

.card-content {
  width: 100%;
  padding-bottom: 0em !important;
}

.img-container {
  margin-top: 1em;
  display: flex;
  justify-content: center;
}
.img {
  width: 80%;
  max-width: 36em;
  max-height: 36em;
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
  min-height: 6.5em;
  overflow: hidden;
  border: 1px thistle solid;
  border-radius: 0.75em;
  margin-bottom: 1em;
}
.description {
  margin: 1em 0 0em 0;
  max-height: 38em;
  overflow: hidden;
  background-color: white;
  border: 1px black solid;
  border-radius: 0.25em;
  padding: 1em 0.5em;
  width: 100% !important;
}
.user-date-block {
  display: flex;
}
.username {
  margin-right: 1em;
}

.subreddit-list {
  width: 25%;
  min-width: 15em;
  height: fit-content;
  margin: 1em;
  margin-top: 0.5em;
  padding: 1em;
  border: 3px thistle solid;
  border-radius: 0.5em;
}
.home {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn {
  color: #7a7a7a;
  font-weight: bold;
  padding: 0.75em 1em 0.75em 1em;
  display: flex;
  margin: auto;
  margin-top: 2em;
  margin-bottom: 1em;
  background-color: thistle;
  border: 1px black;
  border-radius: 0.5em;
  transition: all 150ms ease-in-out;
}
.btn:hover {
  cursor: pointer;
  background-color: rgb(216, 179, 216);
  color: rgba(0, 0, 0, 0.753);
}
.btn:focus {
  outline: none;
  background-color: rgb(207, 159, 207);
  color: black;
  transform: scale(0.95);
}

.text {
  font-weight: 500;
  color: cornflowerblue;
}
</style>
