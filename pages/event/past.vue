<template>
    <v-container
        fluid
        grid-list-lg
        class="mt-0 pt-0"
        >
        <v-layout row>
            <v-flex>
                <v-alert 
                    type="error" 
                    dismissible v-model="alert"
                    transition="scale-transition"
                >
                {{ error ? error.message : "" }}
                </v-alert>
            </v-flex>
        </v-layout>
        <v-layout column v-if="loading">
            <v-flex align-content-center>
                <span class="title">Loading...</span>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-btn v-if="!loading && !error" flat class="secondary" to="/event">See active events</v-btn>
        </v-layout>
        <event-list :auth="auth" :sortedEvents="sortedEvents" v-if="!loading"></event-list>
    </v-container>
</template>
<script>
import events from "@/mixins/events"
export default {
    mixins: [events],
    head() {
        return {
            title: "Past Events"
        }
    },
    computed: {
        //TODO: sort events by newest date 
        sortedEvents() {
            return this.events.sort((a, b) => {
                var dateA = a.date
                var dateB = b.date
                if(dateA < dateB) return -1
                if(dateA > dateB) return 1
                return 0
            }).filter(item => {
                return new Date(item.date) < new Date()
            }).reverse()
        }
    },
    mounted() {
        this.$store.state.appName = "Past Events"
    }
}
</script>
