<template>
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
      <select v-model="sortOption" class="sort-options" @change="sort">
        <option class="sort-option" value="hot">Hot</option>
        <option class="sort-option" value="top">Top</option>
        <option class="sort-option" value="new">New</option>
      </select>
    </div>

    <div class="post" v-for="post in posts" :key="post.id">
      <div class="card-image" v-show="isImage(post.url)">
        <figure class="img">
          <img :src="post.url" alt="img" />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content is-clipped">
            <p class="title is-4" v-show="!post.url">{{post.title}}</p>
            <p class="title is-4" v-show="post.url">
              <a :href="post.url" target="_blank">{{post.title}}</a>
            </p>
            <div class="user-date-block">
              <p class="subtitle username">@johnsmith</p>
              <time class="subtitle">{{post.created_at.toDate().toDateString()}}</time>
            </div>
          </div>
        </div>

        <div class="description">
          <p>{{post.description}}</p>
        </div>
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
  }),
  mounted() {
    this.initSubreddit(this.$route.params.name);
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
    ...mapState('auth', ['user', 'isLoggedIn']),
  },
  methods: {
    ...mapActions('subreddit', ['createPost', 'initSubreddit', 'initPosts']),
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
    lengthCheck(desc) {
      if (desc) {
        return desc.length > 250;
      }
      return false;
    },
    sort() {
      if (this.sortOption === 'top') {
        // this.slides.sort(this.sortAlphaNum)
      } else if (this.sortOption === 'new') {
        this.sortByDate();
      } else if (this.sortOption === 'hot') {
        this.hot();
      }
    },
    sortByDate() {
      return this.posts
        .sort((a, b) => a.created_at.toDate() - b.created_at.toDate())
        .reverse();
    },
    hot() {
      return this.posts;
    },
  },
};
</script>
<style scoped>
.subtitle {
  font-size: 0.75em !important;
  line-height: auto !important;
  margin-bottom: 0 !important;
}
.img {
  width: 10em;
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
  min-height: 10em;
  max-height: 45em;
  overflow: hidden;
  margin: 1em 1em 1em 1em;
  border: #4a4a4a;
  border-radius: 0.75em;
}
.description {
  margin: 1em 0 1em 0;
  max-height: 38em;
  overflow: hidden;
}
.user-date-block {
  display: flex;
}
.username {
  margin-right: 1em;
}

.sort-options {
  border-width: 1px;
  border-color: #d6d6d6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  width: 10em;
  font-weight: 600;
  padding: 0.6em 1em 0.6em 1em;
  margin: 1em 0 0 1em;
}

.sort-options:focus {
  outline: none;
}

.sort-options:hover {
  cursor: pointer;
}

.sort-option {
  font-weight: 600;
}

.submission-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1em;
}

.form {
  width: 80%;
  max-width: 600px;
}
</style>
