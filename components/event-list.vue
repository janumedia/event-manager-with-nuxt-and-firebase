<template>
    <v-layout row wrap>
        <v-flex xs12 md6
            v-for="item in sortedEvents"
            :key="item.id"
            align-content-space-around
            >
            <v-card tile>
                <event-card
                    :isSingleCard="false"
                    :title="item.title"
                    :location="item.location"
                    :lat="item.lat"
                    :long="item.long"
                    :imageURL="item.imageURL"
                    :date="item.date"
                    :time="item.time"
                    :joinedCount="item.joinedCount"
                    >
                </event-card>
                <v-card-actions>
                    <v-btn outline :to="'/event/' + item.id">Detail</v-btn>
                    <v-btn outline :to="'/event/join/' + item.id" v-if="!item.joinLocked">Join</v-btn>
                    <v-btn flat class="error" :to="'/event/edit/' + item.id" v-if="auth">Edit</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import eventCard from "@/components/event-card"
export default {
    props: ["auth", "sortedEvents"],
    components: {
        eventCard
    }
}
</script>
