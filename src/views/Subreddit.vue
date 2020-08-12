<template>
  <!-- eslint-disable max-len -->

  <div>
    <div class="submission-container">
      <!-- eslint-disable-next-line -->
      <button
        v-show="isLoggedIn"
        class="button is-success"
        @click="showForm = !showForm"
      >{{!showForm ? 'Submit Post' : 'Toggle Form'}}</button>
      <form class="form" @submit.prevent="onCreatePost(post)" v-show="showForm">
        <b-field label="Title">
          <b-input v-model="post.title" required></b-input>
        </b-field>
        <b-field label="Description">
          <b-input v-model="post.description" type="textarea"></b-input>
        </b-field>
        <b-field label="URL">
          <b-input v-model="post.url" type="url"></b-input>
        </b-field>
        <button class="button is-success">Submit</button>
      </form>
      <div class="sort-search-container">
        <div class="sort-options">
          <b-dropdown hoverable aria-role="list">
            <button @click="sortByTop()" class="button is-info sort-option" slot="trigger">
              <span>Top</span>
            </button>

            <b-dropdown-item @click="sortByTop()" aria-role="listitem">Top Of All Time</b-dropdown-item>
            <b-dropdown-item @click="sortByTopYear()" aria-role="listitem">Top Of Year</b-dropdown-item>
            <b-dropdown-item @click="sortByTopMonth()" aria-role="listitem">Top Of Month</b-dropdown-item>
            <b-dropdown-item @click="sortByTopWeek()" aria-role="listitem">Top Of Week</b-dropdown-item>
            <b-dropdown-item @click="sortByTopToday()" aria-role="listitem">Top Of Today</b-dropdown-item>
          </b-dropdown>
          <button class="button is-info sort-option" slot="trigger" @click="sortOption = 'new'">
            <span>New</span>
          </button>
        </div>
        <!-- <input class="searchBar" v-model="searchTerm" placeholder="Search..." /> -->
        <b-field class="searchBar-container">
          <!-- type="search" -->
          <input class="searchBar" v-model="searchTerm" placeholder="Search..." />
          <p class="control">
            <button class="button is-primary">Search</button>
          </p>
        </b-field>
      </div>
      <!-- <select v-model="sortOption" class="sort-options" @change="sort">
        <option class="sort-option" value="top">Top</option>
        <option class="sort-option" value="new">New</option>
      </select>-->
    </div>
    <div v-for="(post, i) in filteredPosts" :key="post.id">
      <div class="post">
        <div class="title-votes-container">
          <div v-show="votesLoaded(i)" class="votes-container">
            <button
              class="votes"
              :class="votesLoaded(i) === 1 ? 'votesClicked' : ''"
              @click="onUpvotePost(post.id)"
            >&uarr;</button>
            <p v-show="post.score >= 0">{{ post.score }}</p>
            <p v-show="post.score < 0">0</p>
            <button
              class="votes"
              @click="onDownvotePost(post.id)"
              :class="votesLoaded(i) === -1 ? 'votesClicked' : ''"
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
                  name: $route.params.name,
                  post_id: post.id,
                }
              }"
                  >{{post.title}}</router-link>
                </p>
                <p class="title is-4" v-show="post.url">
                  <a :href="post.url" target="_blank">{{post.title}}</a>
                </p>
                <div class="user-date-block">
                  <p class="subtitle username">Posted by {{loadedUsersById[post.user_id].name}}</p>
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
                  name: $route.params.name,
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
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  data: () => ({
    post: {
      title: '',
      description: '',
      url: '',
    },
    showForm: false,
    sortOption: 'hot',
    searchTerm: '',
  }),
  mounted() {
    this.initSubreddit(this.$route.params.name);
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
    ...mapState('subreddit', ['posts']),
    ...mapGetters('subreddit', ['subreddit']),
    ...mapState('auth', ['isLoggedIn', 'user']),
    ...mapGetters('users', ['usersById']),
    loadedUsersById() {
      return this.posts.reduce((byId, post) => {
        /* eslint-disable */
        byId[post.user_id] = this.usersById[post.user_id] || {
          name: 'Loading',
        };
        /* eslint-enable */
        return byId;
      }, {});
    },
    /* eslint-disable */
    filteredPosts() {
      if (this.searchTerm) {
        return this.sortedPosts.filter((post) => {
          return (
            post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            post.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            post.url.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        });
      }
      return this.sortedPosts;
    },
    sortedPosts() {
      if (this.sortOption) {
        let interval = 2;
        let seconds;
        if (this.sortOption === 'hot') {
          return this.posts;
        }
        if (this.sortOption === 'new') {
          return this.posts
            .sort((a, b) => a.created_at.toDate() - b.created_at.toDate())
            .reverse();
        }
        if (this.sortOption === 'top') {
          return this.posts.sort((a, b) => a.score - b.score).reverse();
        }
        if (this.sortOption === 'topToday') {
          seconds = 86400;
          interval = 1;
        }
        if (this.sortOption === 'topWeek') {
          interval = 8;
          seconds = 86400;
        }
        if (this.sortOption === 'topMonth') {
          seconds = 2592000;
        }
        if (this.sortOption === 'topYear') {
          seconds = 31536000;
        }
        const filtered = this.posts.filter((post) => {
          return (
            (new Date() - post.created_at.seconds * 1000) / (1000 * seconds) <
            interval
          );
        });
        return filtered.sort((a, b) => a.score - b.score).reverse();
      }
      return this.posts;
    },

    votesLoaded() {
      return (index) => {
        try {
          return (
            this.posts[index].votes[this.user.id] ||
            this.posts[index].votes[this.user.id] === 0
          );
        } catch (error) {
          return false;
        }
      };
    },
  },
  methods: {
    ...mapActions('subreddit', [
      'createPost',
      'initSubreddit',
      'initPosts',
      'deletePost',
      'postUpvote',
      'postDownvote',
    ]),

    ...mapActions('users', { initUsers: 'init' }),
    async onCreatePost() {
      if (this.post.title && (this.post.description || this.post.url)) {
        await this.createPost(this.post);
        this.post = {
          title: '',
          description: '',
          url: '',
        };
        this.showForm = false;
      }
    },
    isImage(url) {
      return url.match(/(png|jpg|jpeg|gif)/);
    },
    getCreated(post) {
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
      return timeSince(post.created_at.seconds * 1000) < 0
        ? '0 seconds ago'
        : `${timeSince(post.created_at.seconds * 1000)} ago`;
    },
    async onUpvotePost(post_id) {
      await this.postUpvote(post_id);
    },
    async onDownvotePost(post_id) {
      await this.postDownvote(post_id);
    },

    sortByTop() {
      this.sortOption = 'top';
    },
    sortByTopYear() {
      this.sortOption = 'topYear';
    },
    sortByTopMonth() {
      this.sortOption = 'topMonth';
    },
    sortByTopWeek() {
      this.sortOption = 'topWeek';
    },
    sortByTopToday() {
      this.sortOption = 'topToday';
    },
  },
};
</script>
<style scoped>
.sort-search-container {
  /* padding: 1em; */
  margin: 1em;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.sort-options {
  display: flex;
  justify-content: space-between;
  width: 9em;
  font-weight: 600;
}

.sort-option {
  font-weight: 600;
}

.searchBar-container {
  width: 35%;
  min-width: 16em;
}

.searchBar {
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  max-width: 100%;
  width: 100%;
  background-color: white;
  border: 2px #dbdbdb solid;
  border-right-width: 1px;
  border-radius: 4px;
  font-size: 1rem;
  height: 2.25em;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.75em);
  padding-right: calc(0.75em);
  padding-top: calc(0.375em - 1px);
  font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    'Helvetica', 'Arial', sans-serif;
  transition: all 200ms ease-in-out;
}

.searchBar:focus {
  outline: none;
  border-radius: 0;
  border-top-left-radius: 0.75em;
  border-bottom-left-radius: 0.75em;
  border-color: mediumslateblue;
  border-width: 1.5px;
  border-right-width: 1px;
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
  margin: 1em 1em 1em 1em;
  border: #4a4a4a;
  border-radius: 0.75em;
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

.submission-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form {
  width: 80%;
  max-width: 600px;
}

.bottom {
  width: 100% !important;
  position: relative;
  bottom: 0;
}
</style>
