<template>
    <v-container>
        <v-layout row>
            <v-flex>
                <v-alert 
                    type="info" 
                    dismissible v-model="alert"
                    transition="scale-transition"
                >
                {{ message }}
                </v-alert>
                <v-alert 
                    type="error" 
                    dismissible v-model="error"
                    transition="scale-transition"
                >
                {{ message }}
                </v-alert>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 align-content-space-around>
                <v-card flat>
                    <event-card
                        :isSingleCard="true"
                        :title="title"
                        :desc="desc"
                        :location="location"
                        :imageURL="imageURL"
                        :date="date"
                        :time="time"
                        :lat="lat"
                        :long="long"
                        :joinedCount="joinedCount"
                        >
                    </event-card>
                    <sponsors-small :eventID="id"/>
                    <v-card-actions>
                        <v-layout row wrap>
                            <v-btn outline class="mb-2" :to="'/event/join/' + id" v-if="!joinLocked">Join</v-btn>
                            <v-btn flat to="/event" class="mb-2 secondary">Back</v-btn>
                            <v-btn flat class="mb-2 error" :to="'/event/edit/' + id" v-if="auth">Edit</v-btn>
                            <v-btn flat class="mb-2 primary" @click.stop="showRecap" :disabled="loading" v-if="auth">Show Recap</v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap class="mx-3">
            <v-flex x12 align-content-space-around>
                 <v-layout v-if="loading">
                    <v-flex xs12 class="mt-2">
                        <h3>Loading....</h3>
                    </v-flex>
                </v-layout>
                <v-layout row v-if="!loading && $store.state.reservations.length > 0">
                    <v-flex xs12 sm6>
                    <v-select
                        label="Select type data to show"
                        :items="dataList"
                        v-model="dataType"
                        required
                    >
                    </v-select>
                    </v-flex>
                </v-layout>
                <v-layout v-if="!loading && participants">
                    <v-flex xs12>
                        <v-layout row v-for="participant in sortByClassName(participants)" :key="participant.key">
                            <v-flex>
                                <span :style="{fontWeight: participant.totalPayment ? 'bold':'normal'}">{{participant.className}} - {{participant.name}}</span>
                                <v-tooltip v-if="!participant.totalPayment || participant.totalPayment < participant.totalShouldPay" top>
                                    <v-icon @click.stop="openDialog(participant)" :style="{cursor:'pointer'}" slot="activator">delete_forever</v-icon>
                                    <span>Unregister Participant</span>
                                </v-tooltip>
                                <v-tooltip v-if="!participant.totalPayment || participant.totalPayment < participant.totalShouldPay" top>
                                    <v-icon @click.stop="openDialog(participant, true)" :style="{cursor:'pointer'}" slot="activator">how_to_reg</v-icon>
                                    <span>Confirm Participant Payment</span>
                                </v-tooltip>
                                <v-tooltip v-else-if="participant.totalPayment" top>
                                    <v-icon slot="activator" class="green--text">check_circle</v-icon>
                                    <span>Payment Confirmed</span>
                                </v-tooltip>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <event-recaps-all v-if="!loading && recapsAll"></event-recaps-all>
                <event-recaps-by-class-name v-if="!loading && recapsByClassName"></event-recaps-by-class-name>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" width="80%">
            <v-card v-if="participant">
                <v-card-text class="text-xs-center">
                    <span v-if="participant.confirmPayment">
                        Confirm <b>{{participant.name}} ({{participant.className}})</b><br>payment for {{title}} 
                    </span>
                    <span v-else>
                        Are you sure to unregister <b>{{participant.name}} ({{participant.className}})</b><br>from {{title}}? 
                    </span>
                    <v-text-field
                        class="mt-2"
                        :style="{fontSize: '40px'}"
                        label="Total Payment"
                        type="tel"
                        pattern="^[0-9]*$"
                        suffix="rupiah"
                        v-model="totalPayment"
                        v-if="participant.confirmPayment"
                        :hint="'Total should be paid IDR ' + numFormat(participant.totalShouldPay)"
                    >
                    </v-text-field>
                </v-card-text>
                <v-card-actions class="text-xs-center">
                    <v-layout row class="mb-2">
                        <v-flex>
                            <v-btn
                                flat
                                class="error"
                                :disabled="participant.confirmPayment ? !totalPayment || isNaN(totalPayment) : false"
                                @click.stop="participant.confirmPayment ? confirmPayment(participant) : unregisterUserFromEvent(participant)"
                            >
                            {{participant.confirmPayment ? "Confirm" : "OK"}}
                            </v-btn>
                            <v-btn
                                flat
                                class="secondary"
                                @click.stop="dialog = false"
                            >
                            Cancel
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import {mapState} from "vuex"
import utils from "@/mixins/utils"
import eventDetail from "@/mixins/event-detail"
import eventRecapsByClassName from "@/components/event-recaps-by-classname"
import eventRecapsAll from "@/components/event-recaps-all"
import sponsorsSmall from "@/components/sponsors-small"
export default {
    mixins: [utils, eventDetail],
    components: {
        eventRecapsAll,
        eventRecapsByClassName,
        sponsorsSmall
    },
    head() {
        return {
            title: this.title,
            meta: [
                { hid: "description", name: "description", content: this.desc },
                { hid: "og:title", property: "og:title", content: this.title },
                { hid: "og:description", property: "og:description", content: this.desc },
                { hid: "og:site_name", property: "og:site_name", content: this.title },
                { hid: "og:type", property: "og:type", content: "event" },
                { hid: "og:start_date", property: "og:start_date", content: new Date(this.date.split("-").join("/") + " " + this.time).toISOString() },
                { hid: "og:image", property: "og:image", content: this.imageURL },
                { hid: "twitter:card", name: "twitter:card", content: "summary" },
                { hid: "twitter:title", name: "twitter:title", content: this.title },
                { hid: "twitter:description", name: "twitter:description", content: this.desc },
                { hid: "twitter:image", name: "twitter:image", content: this.imageURL }
            ]
        }
    },
    data() {
        return {
            dataList: ["Participants", "Recaps by class name", "Recaps all"],
            dataType: null,
            dialog: false,
            participant: null,
            totalPayment: null,
            alert: false,
            error: false,
            message: null
        }
    },
    computed: {
        ...mapState(["auth", "loading"]),
        participants() {
            if(this.dataType == this.dataList[0]) {
                return this.$store.state.reservations.map(item => {
                    let extraTshirt = 0
                    let extraPerson = 0
                    Object.keys(item).map(key => {
                        if(key == "adult") extraTshirt += item[key]
                        if(key == "child") extraTshirt += item[key]
                        if(key == "maleXXL") extraTshirt += item[key]
                        if(key == "maleXL") extraTshirt += item[key]
                        if(key == "maleL") extraTshirt += item[key]
                        if(key == "maleM") extraTshirt += item[key]
                        if(key == "maleS") extraTshirt += item[key]
                        if(key == "femaleXXL") extraTshirt += item[key]
                        if(key == "femaleXL") extraTshirt += item[key]
                        if(key == "femaleL") extraTshirt += item[key]
                        if(key == "femaleM") extraTshirt += item[key]
                        if(key == "femaleS") extraTshirt += item[key]
                    })
                    let consumption = item.going ? this.rates.consumption : 0
                    let donation = item.donation ? parseInt(item.donation) : 0
                    let totalShouldPay = this.rates.tshirt + consumption + this.rates.extraPerson * extraPerson + this.rates.extraTshirt * extraTshirt + donation
                    return {
                        key: item.key, 
                        name:item.name, 
                        className: item.className,
                        going: item.going,
                        totalShouldPay,
                        totalPayment: item.totalPayment
                    }
                })
            }
            return null
        },
        recapsByClassName() {
            if(this.dataType == this.dataList[1]) {
                return {}
            }
            return null
        },
        recapsAll() {
            if(this.dataType == this.dataList[2]) {
                return {}
            }
            return null
        }
        
    },
    methods: {
        showRecap() {
            this.$store.dispatch("loadReservations", this.id)
            .then(() => {})
            .catch(error => {
                console.log(error)
                window.scrollTo(0, 0)
                this.message = error
                this.error = true
                this.dialog = false
            })
        },
        openDialog(participant, confirmPayment) {
            this.dialog = true
            this.totalPayment = participant.totalPayment//null
            
            this.participant = {
                ...participant,
                /*name: participant.name, 
                className: participant.className, 
                key: participant.key, 
                totalShouldPay: participant.totalShouldPay,*/
                confirmPayment: confirmPayment || false
            }
        },
        confirmPayment(){
            this.$store.dispatch("confirmUserPaymentToEvent", {
                eventID: this.id, 
                key: this.participant.key,
                totalPayment: parseInt(this.totalPayment)
            })
            .then(() => {
                window.scrollTo(0, 0)
                this.message = this.participant.name + " payment has confirmed"
                this.alert = true
                this.dialog = false
            })
            .catch(error => {
                console.log(error)
                window.scrollTo(0, 0)
                this.message = error
                this.error = true
                this.dialog = false
            })
        },
        unregisterUserFromEvent(){
            this.$store.dispatch("unregisterUserFromEvent", {
                eventID: this.id, 
                key:this.participant.key
            })
            .then(() => {
                window.scrollTo(0, 0)
                this.message = this.participant.name + " has unregistered"
                this.alert = true
                this.dialog = false
            })
            .catch(error => {
                console.log(error)
                window.scrollTo(0, 0)
                this.message = error
                this.error = true
                this.dialog = false
            })
        }
    },
    mounted() {
        this.$store.state.appName = this.title
        this.$store.state.appName = "Edit Event - " + this.title 
    }
}
</script>
