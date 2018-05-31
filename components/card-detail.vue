<template>
    <div>
        <h4 class="mb-2 grey--text">{{ title }}</h4>
        <h2>{{name}}</h2>
        {{className}}, <span v-if="!going">Not </span>Going<span class="grey--text" v-if="!going">&nbsp;:(</span>
        <v-divider class="my-4" v-if="parseInt(donation) > 0"></v-divider>
        <v-layout row  v-if="parseInt(donation) > 0">
            <v-flex xs3 :class="sponsorClassBg + ' sponsor--right'"></v-flex>
            <v-flex xs8>
                <div>
                    <h4>{{donationType}}</h4>
                    <h2 :class="sponsorClassText">IDR {{numFormat(donation)}}</h2>
                    <h4>Thank You!</h4>
                </div>
            </v-flex>
            <v-flex xs3 :class="sponsorClassBg + ' sponsor--left'"></v-flex>
        </v-layout>
        <v-divider class="my-4"></v-divider>
        <div :class="paid ? 'paid' : ''">
            <h4>Total</h4>
            <h1>{{totalFormatted}}</h1>
            <h3 v-if="!paid && totalPaymentFormatted"><span class="error--text">{{totalPaymentFormatted}}</span> paid</h3>
            <p class="grey--text" v-if="room">
                room not included / pay on location<sup>*</sup>
            </p>
        </div>
        <v-divider class="my-4"></v-divider>
        <div class="mb-3"><h3 @click="toggleDetails()">{{showDetailLabel}}</h3></div>
        <div v-if="showDetail">
            <h4>Registration & T-Shirt <span class="grey--text">IDR {{numFormat(rates.tshirt)}}</span></h4>
            <h4 v-if="going">Consumption <span class="grey--text">IDR {{numFormat(rates.consumption)}}</span></h4>
            <h4>T-Shirt size <span class="grey--text">{{selectedTshirtLabel}}</span></h4>
            <h4 v-if="room">1 night bedroom <span class="grey--text">IDR {{numFormat(rates.room)}}</span></h4>
            <h4 v-if="camp">Camping ground <span class="grey--text">Free / setup your own</span></h4>
            <h4 v-if="adult > 0 || child > 0">Extra Person:</h4>
            <h4 v-if="adult > 0">{{adult}} Adult <span class="grey--text">IDR {{numFormat(rates.extraPerson)}} / person</span></h4>
            <h4 v-if="child > 0">{{child}} Child <span class="grey--text">IDR {{numFormat(rates.extraPerson)}} / person</span></h4>
            <h4 v-if="totalTshirts > 0">Extra T-Shirt:</h4>
            <h4 v-for="item in extraTshirts" :key="item.label">{{item.value}} {{item.label}} <span class="grey--text">IDR {{numFormat(rates.extraPerson)}} / pcs</span></h4>
            <v-divider class="my-4"></v-divider>
        </div>
    </div>
</template>
<script>
import utils from "@/mixins/utils"
export default {
    props: ["title", "name", "className", "going", "room", "camp",
            "totalFormatted", "donation", "rates", "adult", "child", 
            "selectedTshirtLabel", "totalTshirts", "extraTshirts", "paid", "totalPaymentFormatted"],
    mixins: [utils],
    data() {
        return {
            showDetail: false,
            showDetailLabel: "Show details.."
        }
    },
    computed: {
        donationType() {
            if(this.donation >= 10000000) return "Platinum Sponsor";
            if(this.donation >= 5000000) return "Gold Sponsor";
            if(this.donation >= 2500000) return "Silver Sponsor";
            if(this.donation >= 1500000) return "Bronze Sponsor";
            return "Donation"
        },
        sponsorClassBg() {
            if(this.donation >= 10000000) return "sponsor__platinum";
            if(this.donation >= 5000000) return "sponsor__gold";
            if(this.donation >= 2500000) return "sponsor__silver";
            if(this.donation >= 1500000) return "sponsor__bronze";
            return "";
        },
        sponsorClassText() {
            if(this.donation >= 10000000) return "sponsor__platinum--text";
            if(this.donation >= 5000000) return "sponsor__gold--text";
            if(this.donation >= 2500000) return "sponsor__silver--text";
            if(this.donation >= 1500000) return "sponsor__bronze--text";
            return "error--text";
        }
    },
    methods: {
        toggleDetails(){
            this.showDetail = !this.showDetail
            this.showDetailLabel = (this.showDetail ? "Hide" : "Show") + " details.."
        }
    }
}
</script>
<style lang="scss" scoped>
//sponsorship color
.sponsor--left {
    margin-left: 10px;
    background-position-x: left !important;
}
.sponsor--right {
    margin-right: 10px;
    background-position-x: right !important;
}
.sponsor__platinum {
    background-image: url("/images/platinum-sponsor.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}
.sponsor__gold {
    background-image: url("/images/gold-sponsor.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}
.sponsor__silver {
    background-image: url("/images/silver-sponsor.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}
.sponsor__bronze {
    background-image: url("/images/bronze-sponsor.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}
.sponsor__platinum--text {
    color: #757475;
}
.sponsor__gold--text {
    color: #8F7755;
}
.sponsor__silver--text {
    color: #8D8D8D;
}
.sponsor__bronze--text {
    color: #8F7755;
}
//paid bagde
.paid {
    background-image: url("/images/paid.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    background-position-y: center;
}
</style>
