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
            <v-btn v-if="auth && !loading" flat class="primary" to="/event/create">Create New Event</v-btn>
            <v-btn v-if="!loading && !error" flat class="secondary" to="/event/past">See past events</v-btn>
        </v-layout>
        <event-list :auth="auth" :sortedEvents="sortedEvents" v-if="!loading"></event-list>
    </v-container>
</template>
<script>
import events from "@/mixins/events"
export default {
    mixins: [events]
}
</script>
