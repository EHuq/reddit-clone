<template>
  <div id="app">
    <b-navbar class="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">frauddit</b-navbar-item>
      </template>
      <template slot="start">
        <!-- <b-navbar-item href="#">Home</b-navbar-item> -->
        <!-- <b-navbar-dropdown label="Info">
          <b-navbar-item href="#">About</b-navbar-item>
          <b-navbar-item href="#">Contact</b-navbar-item>
        </b-navbar-dropdown>-->
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button v-show="isLoggedIn" type="is-danger" @click="logout()">Log Out</b-button>
            <!-- eslint-disable-next-line max-len -->
            <b-button v-show="!isLoggedIn" type="is-danger" @click="login()">Log In With Google</b-button>
            <div class="control" v-show="isLoggedIn">
              <section class="avatar">
                <figure>
                  <img class="is-rounded" :src="user.image" />
                </figure>
              </section>
            </div>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view class="main container" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: mapState('auth', ['user', 'isLoggedIn']),
  methods: mapActions('auth', ['login', 'logout']),
};
</script>

<style lang="scss">
.main {
  margin-top: 2em;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.is-rounded {
  border: 1px;
  border-radius: 50%;
}
</style>
