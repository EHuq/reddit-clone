<template>
  <div>
    <div class="post">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">
              <a
                :href="post.url"
                target="blank"
                v-show="post.url && !isImage(post.url)"
              >{{post.title}}</a>
            </p>
            <p v-show="!post.url" class="title is-4">{{post.title}}</p>
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
        <figure v-show="post.url && isImage(post.url)" class="img">
          <img :src="post.url" alt="img" />
        </figure>
      </div>
    </div>

    <!-- comment submission -->

    <div class="submission-sort-container">
      <div v-show="isLoggedIn" class="submission-container">
        <!-- eslint-disable-next-line -->
        <button
          class="button is-success"
          @click="showForm = !showForm"
          :class="showForm ? 'btn-toggle': ''"
        >{{!showForm ? 'Submit Post' : 'Toggle Form'}}</button>
        <form class="form" @submit.prevent="onCreateComment(comment)" v-show="showForm">
          <b-field label="Comment">
            <b-input v-model="comment.text" type="textarea"></b-input>
          </b-field>
          <button class="button is-success">Submit</button>
        </form>
      </div>
      <div class="logInMessage" v-show="!isLoggedIn">
        Log In To Comment
        <button class="logInButton" @click="login()">Log In</button>
      </div>
      <select v-model="sortOption" class="sort-options" @change="sort">
        <option class="sort-option" value="hot">Hot</option>
        <option class="sort-option" value="top">Top</option>
        <option class="sort-option" value="new">New</option>
      </select>
    </div>
    <!-- the comments -->
    <div v-for="comment in comments" :key="comment.id">
      <div class="comments-primary">{{comment.text}}</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions, mapGetters } from 'vuex';
/* eslint-enable */

export default {
  data: () => ({
    showForm: false,
    sortOption: 'hot',
    comment: {
      text: '',
    },
  }),
  mounted() {
    this.initSubreddit(this.$route.params.name);
    this.initPost(this.$route.params.post_id);
    this.initUsers();
    this.initComments(this.$route.params.post_id);
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
    ...mapState('post', ['posts', 'comments']),
    ...mapGetters('post', ['post']),
    ...mapState('auth', ['isLoggedIn', 'user']),
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
    ...mapActions('auth', ['login']),
    ...mapActions('post', [
      'initSubreddit',
      'initPost',
      'initComments',
      'createComment',
    ]),
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
    isImage(url) {
      return url.match(/(png|jpg|jpeg|gif)/);
    },
    async onCreateComment(comment) {
      if (this.comment.text && this.isLoggedIn) {
        await this.createComment(this.comment);
        this.comment = {
          text: '',
        };
        this.showForm = false;
      }
    },
    sort() {
      console.log('sorting');
      // if (this.sortOption === 'top') {
      //   // this.slides.sort(this.sortAlphaNum)
      // } else if (this.sortOption === 'new') {
      //   this.sortByDate();
      // } else if (this.sortOption === 'hot') {
      //   this.hot();
      // }
    },
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
.comments-primary {
  width: 100%;
  padding: 1em;
  margin: 2em 0em 0 1em;
  border: 1px solid rgba(156, 156, 156, 0.37);
  border-left: 5px solid black;
  border-radius: 0.3em;
  transition: all 300ms ease-in-out;
}
.comments-primary:hover {
  border-color: rgba(90, 133, 212, 0.37);
  border-left-color: rgb(90, 133, 212);
}

.logInMessage {
  border: 1px aliceblue;
  border-radius: 0.25em;
  box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.2);
  width: 50%;
  max-width: 23em;
  display: flex;
  justify-content: space-between;
  margin: auto 0 auto 0;
  padding: 0.25em 0.5em 0.25em 0.5em;
  font-weight: 600;
}

.logInButton {
  background-color: #ff3860;
  border-color: transparent;
  color: #fff;
  border-width: 1px;
  border-radius: 0.35em;
  cursor: pointer;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;

  text-align: center;
  white-space: nowrap;
  font-weight: 600;
  padding: 0.25em 0.5em 0.25em 0.5em;
}

.button {
  width: fit-content !important;
}

.btn-toggle {
  background-color: cornflowerblue;
  border-color: #dbdbdb;
  border-width: 1px;
  color: white;
  cursor: pointer;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  padding-bottom: calc(0.375em - 1px);
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: calc(0.375em - 1px);
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.btn-toggle:hover {
  background-color: rgb(90, 133, 212);
}

.submission-container {
  width: 70%;
  display: flex;
  flex-direction: column;
}

.sort-options {
  border-width: 1px;
  border-color: #d6d6d6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  width: 10em;
  height: 2.25em;
  font-weight: 600;
}

.submission-sort-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  padding-right: 1em;
}

.form {
  width: 100%;
  max-width: 700px;
}

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
  min-height: 6.5em;
  overflow: hidden;
  margin: 1em 1em 1em 1em;
  border: #4a4a4a;
  border-radius: 0.75em;
}
.content {
  margin-top: 2em !important;
}
.img {
  max-width: 575px;
  margin: auto;
  margin-top: 1em;
}
</style>
