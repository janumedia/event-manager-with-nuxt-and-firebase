import {mapState} from "vuex"
export default {
    props: ["eventID"],
    data() {
        return {
            //platinumMinLimit: 10000000,
            //goldMinLimit: 5000000,
            //silverMinLimit: 2500000,
            //bronzeMinLimit: 1500000,
            sponsors: []
        }
    },
    computed: {
        ...mapState(["sponsorship"]),
        platinumMinLimit() { return this.sponsorship.platinumMinLimit },
        goldMinLimit() { return this.sponsorship.goldMinLimit },
        silverMinLimit() { return this.sponsorship.silverMinLimit },
        bronzeMinLimit() { return this.sponsorship.bronzeMinLimit },
        platinumSponsors() {
            return this.sponsors.filter(sponsor => {
                return sponsor.donation >= this.platinumMinLimit
            })
        },
        goldSponsors() {
            return this.sponsors.filter(sponsor => {
                return sponsor.donation >= this.goldMinLimit && sponsor.donation < this.platinumMinLimit
            })
        },
        silverSponsors() {
            return this.sponsors.filter(sponsor => {
                return sponsor.donation >= this.silverMinLimit && sponsor.donation < this.goldMinLimit
            })
        },
        bronzeSponsors() {
            return this.sponsors.filter(sponsor => {
                return sponsor.donation >= this.bronzeMinLimit && sponsor.donation < this.silverMinLimit
            })
        }
    },
    mounted() {
        this.$store.dispatch("loadSponsors", this.eventID)
        .then(data => {
            //show sponsors with logo only
            this.sponsors = data.filter(sponsor => {
                return sponsor.imageURL || (sponsor.imageURL && sponsor.imageURL.length > 0)
            })
            //short from biggest donation
            .sort((a, b) => {
                var dateA = a.donation
                var dateB = b.donation
                if(dateA > dateB) return -1
                if(dateA < dateB) return 1
                return 0
            })
        })
        .catch(error => {
             console.log(error)
        })
    }
}