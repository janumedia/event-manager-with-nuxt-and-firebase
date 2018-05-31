<template>
    <v-container class="text-xs-center">
        <h1 class="mt-2 title grey--text">Congratulations!!!</h1>
        <h2 class="mt-2">{{name}}</h2>
        <span class="subheading">has joined</span>
        <h4 class="mt-2 heading">{{ eventDetail ? eventDetail.title.toUpperCase() : ""}}</h4>
        <div class="mt-2 fullWidth">
           <img :src="eventDetail.imageURL" :alt="eventDetail.desc" srcset="">
        </div>
        <div class="subheading mt-1 pl-0" v-if="eventDetail">
            <div>
                <v-icon>location_on</v-icon>&nbsp;{{ eventDetail ? eventDetail.location : ""}}
            </div>
        </div>
        <v-flex xs12 class="mt-1 pl-0" v-if="eventDetail">
            <v-icon>event</v-icon>&nbsp;{{ dateFormatted }} WITA
        </v-flex>
        <div class="mt-3">
            <v-layout row class="mb-2">
                <v-flex>
                    <v-btn
                        flat
                        class="primary"
                        :to="'/event/' + eventID"
                    >
                    Back
                    </v-btn>
                    <v-btn
                        flat
                        class="secondary"
                        :to="'/card/' + eventID + '/' + cardID + '/detail'"
                    >
                    Detail
                    </v-btn>
                </v-flex>
            </v-layout>
        </div>
    </v-container>
</template>
<script>
import {mapState} from "vuex"
import utils from "@/mixins/utils"
import card from "@/mixins/card"
export default {
    asyncData({store, redirect, params}) {
        if(params.event !== undefined && params.id !== undefined) {
            return  store.dispatch("loadReservationCard", {...params})
                    .then (data => {
                        return {
                            ...data,
                            cardID: params.id
                        }
                    })
                    .catch(() => {
                        redirect(store.state.home)
                    })
        } else
        {
            redirect(store.state.home)
        }
    },
    mixins:[card, utils],
    head() {
        return {
            title: "Reservation Card"
        }
    },
    computed: {
        ...mapState(["home", "eventDetail"]),
        dateFormatted() {
            if(this.eventDetail) return this.formatDate(this.eventDetail.date, this.eventDetail.time)
            return ""
        }
    },
    mounted() {
        this.$store.state.appName = "Reservation Card"
        this.$store.dispatch("detailEvent", this.eventID)
    }
}
</script>
<style lang="scss" scoped>
.fullWidth {
    width: 100%;
    text-align:center;
    margin-bottom: 20px;
    >img {
        width: 400px;
    }
}
@media only screen and (max-width:500px) {
    .fullWidth {
        >img {
            width: 90%;
        }
    }
}
</style>