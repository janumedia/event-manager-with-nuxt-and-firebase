<template>
    <div>
        <v-card-media
            class="white--text"
            :src="imageURL" 
            :height="imageHeight">
            <v-container fluid class="mb-0 pl-2 pb-2">
            <v-layout v-if="!desc">
                <v-flex xs12>
                    <v-icon x-large dark>event</v-icon>
                    <span class="subheading">{{ dateFormatted }} WITA</span>
                </v-flex>
            </v-layout>
            </v-container>
        </v-card-media>
        <v-card-title primary-title>
            <v-flex xs12>
                <div>
                <h3 class="headline">{{ title }}</h3>
                <!--
                TODO: link to location direction
                https://www.google.com/maps/dir//-8.552585,115.134077
                -->
                <div class="subheading mt-1 pl-0">
                    <div v-if="lat && long">
                        <a :href="'https://www.google.com/maps/dir//'+lat+','+long" target="_blank">
                            <v-icon>location_on</v-icon>&nbsp;{{ location }}
                        </a>
                    </div>
                    <div v-else>
                        <v-icon>location_on</v-icon>&nbsp;{{ location }}
                    </div>
                </div>
                <v-flex xs12 class="mt-1 pl-0" v-if="desc">
                  <v-icon>event</v-icon>&nbsp;{{ dateFormatted }} WITA
                </v-flex>
                <v-flex xs12 class="grey--text text--darken-1 pl-0">
                    <v-icon class="grey--text text--lighten-1">supervisor_account</v-icon>
                    <span class="body-1">&nbsp;{{ joinedCount == 0 ? "No" : joinedCount }} people joined{{ joinedCount == 0 ? " yet" : "" }}</span>
                </v-flex>
                </div>
            </v-flex>
            <v-layout row class="mt-3" v-if="desc">
                <v-flex xs12>{{ desc }}</v-flex>
            </v-layout>
        </v-card-title>
    </div>
</template>
<script>
import utils from "@/mixins/utils"
export default {
    props: ["isSingleCard", "title", "desc", "location", "date", "time", 
            "imageURL", "joinedCount", "lat", "long"],
    mixins: [utils],
    computed: {
        imageHeight() {
            switch(this.$vuetify.breakpoint.name) {
                case "xs":
                    return "300px"
                case "sm":
                    return this.isSingleCard ? "450px": "400px"
                case "md":
                    return this.isSingleCard ? "600px" : "300px"
                case "lg":
                    return this.isSingleCard ? "700px" : "450px"
                case "xl":
                    return this.isSingleCard ? "900px" : "600px"
            }
        },
        dateFormatted() {
            return this.formatDate(this.date, this.time)
        }
    }
}
</script>
<style scoped>
/* remove underline */
a:-webkit-any-link {
    text-decoration: none;
}
a:hover,
a:hover .material-icons {
    color: #000
}
</style>
