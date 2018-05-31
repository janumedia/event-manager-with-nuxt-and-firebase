<template>
    <v-layout>
        <v-flex xs12>
            <v-layout row v-for="(item, index) in sortByClassName(list)" :key="index">
                <v-flex>{{item.className}}: {{item.count}}<span class="grey--text" v-if="item.notGoing >0"> - {{item.notGoing}} not going</span></v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
import utils from "@/mixins/utils"
export default {
    mixins: [utils],
    computed: {
        list() {
            let obj = {}
            this.$store.state.reservations.map(item => {
                if(!obj[item.className]) obj[item.className] = {className: item.className, count:0, notGoing:0}
                if(!item.going) obj[item.className].notGoing++
                obj[item.className].count++
                return item
            })
            return Object.keys(obj).map(key => {
                return obj[key]
            })
        }
    }
}
</script>
