<template>
    <v-app>
        <v-navigation-drawer 
            fixed
            class="hidden-sm-and-up"
            v-model="showDrawer">
            <v-toolbar dark color="primary" flat>
                <v-list>
                <v-list-tile>
                    <v-list-tile-title class="title">
                        <router-link 
                        :to="home"
                        tag="span"
                        style="cursor: pointer"
                        >
                        <v-layout>
                            <v-icon>home</v-icon>&nbsp;&nbsp;Home
                        </v-layout>
                    </router-link>
                    </v-list-tile-title>
                </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list>
                <v-list-tile 
                v-for="item in menuItems" 
                :key="item.title"
                :to="item.link"
                >
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-badge color="red" v-if="item.badge">
                        <span slot="badge">{{ item.badge }}</span>
                        <span>{{ item.title }}</span>
                    </v-badge>
                    <v-list-tile-content v-else>{{ item.title }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/login" v-if="!auth">
                    <v-list-tile-action>
                        <v-icon>lock</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>Admin</v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click.stop="logout" v-if="auth">
                    <v-list-tile-action>
                        <v-icon>exit_to_app</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>Logout</v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="primary" 
            dark
            flat 
            fixed 
            scroll-off-screen
            >
            <v-toolbar-side-icon 
                @click.stop="showDrawer = !showDrawer"
                class="hidden-sm-and-up"
            >
            </v-toolbar-side-icon>
            <v-toolbar-title>
                <v-layout>
                    <router-link 
                        :to="home"
                        tag="span"
                        style="cursor: pointer"
                        class="hidden-xs-only"
                        >
                        <v-layout>
                            <v-icon>home</v-icon>&nbsp;&nbsp;
                        </v-layout>
                    </router-link>
                    {{ appName }}
                </v-layout>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-xs-only">
                <v-btn flat 
                v-for="item in menuItems" 
                :key="item.title"
                :to="item.link"
                >
                    <v-icon left>{{ item.icon }}</v-icon>
                    <v-badge v-if="item.badge" color="red">
                        <span slot="badge">{{ item.badge }}</span>
                        <span>{{ item.title }}</span>
                    </v-badge>
                    <span v-else>{{ item.title }}</span>
                </v-btn>
                <v-btn flat to="/login" v-if="!auth">
                    <v-icon left>lock</v-icon>
                    <span>Admin</span>
                </v-btn>
                <v-btn flat @click.stop="logout" v-if="auth">
                    <v-icon left>exit_to_app</v-icon>
                    <span>Logout</span>
                </v-btn>
            </v-toolbar-items>  
        </v-toolbar>
        <main>
            <nuxt/>
        </main>
        <br><br>
        <v-footer absolute>
            <v-layout row>
                <v-flex xs12>
                    <br>
                    <p class="text-xs-center">&copy;2018 — <strong>Peter Parker</strong></p>
                </v-flex>
            </v-layout>
        </v-footer>
    </v-app>
</template>
<script>
import {mapState} from "vuex"

export default {
    data() {
        return {
            showDrawer: false,
            menuItems: [
                {icon: 'date_range', title: 'Event Calendar', link: '/event'}
            ]
        }
    },
    computed: {
        ...mapState(["appName", "home", "auth"])
    },
    methods: {
        logout() {
            this.$store.dispatch("logout")
            this.$router.push("/")
        }
    }
}
</script>
<style lang="scss" scoped>
main {
    margin-top: 60px;
    transition: all .5s cubic-bezier(.55,0,.1,1);
}
.container {
    padding: 10px;
}
.page-enter-active, .page-leave-active {
  transition: opacity .5s
}
.page-enter, .page-leave-active {
  opacity: 0
}
@media only screen and (min-width: 500px) {
    .container {
        padding: 20px;
    }
}
</style>