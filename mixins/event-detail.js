import {mapState} from "vuex"
import eventCard from "@/components/event-card"
export default {
    asyncData({store, redirect, params, env}) {
        if(store.state.eventDetail && 
           store.state.eventDetail.id == params.id)
        {
            return {
                //rates: env.rates,
                //tshirtSizes: env.tshirtSizes
            }
        }
        return  store.dispatch("detailEvent", params.id)
                .then (data => {
                    return {
                        //rates: env.rates,
                        //tshirtSizes: env.tshirtSizes
                    }
                })
                .catch(error => {
                    console.log("error", error)
                    redirect(env.redirect.toEvent)
                })
    },
    components: {
        eventCard
    },
    computed: {
        ...mapState(["eventDetail", "rates", "tshirtSizes"]),
        id() {
            return this.eventDetail.id
        },
        title: {
            get(){
                return this.eventDetail.title
            },
            set(value) {
                this.eventDetail.title = value
            }
        },
        desc: {
            get() {
                return this.eventDetail.desc
            },
            set(value) {
                this.eventDetail.desc = value
            }
        },
        location: {
            get() {
                return this.eventDetail.location
            },
            set(value) {
                this.eventDetail.location = value
            }
        },
        lat() {
            return this.eventDetail.lat
        },
        long() {
            return this.eventDetail.long
        },
        imageURL: {
            get() {
                return this.eventDetail.imageURL
            },
            set(value) {
                this.eventDetail.imageURL = value
            }
        },
        date: {
            get() {
                return this.eventDetail.date
            },
            set(value) {
                this.eventDetail.date = value
            }
        },
        time: {
            get() {
                return this.eventDetail.time
            },
            set(value) {
                this.eventDetail.time = value
            }
        },
        joinedCount() {
            return this.eventDetail.joinedCount
        },
        joinLocked: {
            get() {
                return this.eventDetail.joinLocked
            },
            set(value) {
                this.eventDetail.joinLocked = value
            }
        }
    },
    mounted() {
        this.$store.dispatch("setCurrentEventSync", this.id)
    },
    beforeDestroy() {
        this.$store.dispatch("removeCurrentEventSync", this.id)
        this.$store.dispatch("clearReservations", this.id)
        this.$store.dispatch("setLoading", false)
    }
}