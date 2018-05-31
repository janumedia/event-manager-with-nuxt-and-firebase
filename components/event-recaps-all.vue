<template>
    <v-layout>
        <v-flex xs12>
            <v-layout row>
                <v-flex>Joined: {{joined}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Going: {{going}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Room: {{rooms}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Camp: {{camps}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Donation: IDR {{numFormat(donations)}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Adult: {{adult}}</v-flex>
            </v-layout>
            <v-layout row>
                <v-flex>Child: {{child}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleXXXL">
                <v-flex>Male XXXL: {{maleXXXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleXXL">
                <v-flex>Male XXL: {{maleXXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleXL">
                <v-flex>Male XL: {{maleXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleL">
                <v-flex>Male L: {{maleL}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleM">
                <v-flex>Male M: {{maleM}}</v-flex>
            </v-layout>
            <v-layout row v-if="maleS">
                <v-flex>Male S: {{maleS}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleXXXL">
                <v-flex>Female XXXL: {{femaleXXXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleXXL">
                <v-flex>Female XXL: {{femaleXXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleXL">
                <v-flex>Female XL: {{femaleXL}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleL">
                <v-flex>Female L: {{femaleL}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleM">
                <v-flex>Female M: {{femaleM}}</v-flex>
            </v-layout>
            <v-layout row v-if="femaleS">
                <v-flex>Female S: {{femaleS}}</v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>
<script>
import utils from "@/mixins/utils"
export default {
    mixins: [utils],
    computed: {
        joined() {
            return this.$store.state.reservations.length;
        },
        going() {
            return this.$store.state.reservations.filter(item => item.going).length;
        },
        rooms() {
            return this.$store.state.reservations.filter(item => item.room).length
        },
        camps() {
            return this.$store.state.reservations.filter(item => item.camp).length
        },
        donations() {
            let arr = this.$store.state.reservations.filter(item => item.donation)
            if(arr.length == 0) return 0
            return arr.map(item => item.donation * 1).reduce((total, item) => total + item)
        },
        adult() {
            if(this.$store.state.reservations.length == 0) return 0
            let arr = this.$store.state.reservations.filter(item => item.adult)
            if(arr.length == 0) return 0
            return arr.map(item => parseInt(item.adult)).reduce((total, item) => total + item) + this.joined
        },
        child() {
            if(this.$store.state.reservations.length == 0) return 0
            let arr = this.$store.state.reservations.filter(item => item.child)
            if(arr.length == 0) return 0
            return arr.map(item => parseInt(item.child)).reduce((total, item) => total + item)
        },
        maleXXXL() {
            return this.getTshirts("maleXXXL", "XXXL male")
        },
        maleXXL() {
            return this.getTshirts("maleXXL", "XXL male")
        },
        maleXL() {
            return this.getTshirts("maleXL", "XL male")
        },
        maleL() {
            return this.getTshirts("maleL", "L male")
        },
        maleM() {
            return this.getTshirts("maleM", "M male")
        },
        maleS() {
            return this.getTshirts("maleS", "S male")
        },
        femaleXXXL() {
            return this.getTshirts("femaleXXXL", "XXXL female")
        },
        femaleXXL() {
            return this.getTshirts("femaleXXL", "XXL female")
        },
        femaleXL() {
            return this.getTshirts("femaleXL", "XL female")
        },
        femaleL() {
            return this.getTshirts("femaleL", "L female")
        },
        femaleM() {
            return this.getTshirts("femaleM", "M female")
        },
        femaleS() {
            return this.getTshirts("femaleS", "S female")
        },
    },
    methods: {
        getTshirts(key, label) {
            if(this.$store.state.reservations.length == 0) return 0
            // get extra first
            let arr = this.$store.state.reservations.filter(item => item[key])
                    .map(item => parseInt(item[key]))
            let count = arr.length > 0 ? arr.reduce((total, item) => total + item) : 0
            // then get from participants
            arr = this.$store.state.reservations.filter(item => item.tshirt === key)
            return count + arr.length
            
        }
    }
}
</script>
