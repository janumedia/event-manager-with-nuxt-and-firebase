<template>
    <v-container class="text-xs-center">
        <card-detail
        :title="title"
        :name="name"
        :className="className"
        :going="going"
        :room="room"
        :camp="camp"
        :totalFormatted="totalFormatted"
        :donation="donation"
        :paid="paid"
        :totalPaymentFormatted="totalPaymentFormatted"
        :rates="rates"
        :adult="adult"
        :child="child"
        :selectedTshirtLabel="selectedTshirtLabel"
        :totalTshirts="totalTshirts"
        :extraTshirts="extraTshirts"
        >
        </card-detail>
        <card-add-on></card-add-on>
        <div class="mt-2">
            <v-btn
                flat
                class="primary"
                :to="'/card/' + eventID + '/' + cardID"
                >
                Back
            </v-btn>
        </div>
    </v-container>
</template>
<script>
import {mapState} from "vuex"
import card from "@/mixins/card"
export default {
    asyncData({store, redirect, params, env}) {
        if(params.event !== undefined && params.id !== undefined) {
            return  store.dispatch("loadReservationCard", {...params})
                    .then (data => {
                        //TODO: add fixed for participant not transfered for payment yet
                        if(!data.totalPayment) data.totalPayment = null
                        return {
                            ...data,
                            cardID: params.id,
                            rates: env.rates,
                            tshirtSizes: env.tshirtSizes
                        }
                    })
                    .catch(error => {
                        console.log(error)
                        //redirect(store.state.home)
                    })
        } else
        {
            //redirect(store.state.home)
        }
    },
    mixins:[card],
    head() {
        return {
            title: "Reservation Card"
        }
    },
    computed: {
        ...mapState(["home", "eventDetail"]),
        title() {
            return this.eventDetail ? this.eventDetail.title : "";
        }
    },
    mounted() {
        this.$store.state.appName = "Reservation Card"
        this.$store.dispatch("detailEvent", this.eventID)
    }
}
</script>