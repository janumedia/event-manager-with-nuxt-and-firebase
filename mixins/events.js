import {mapState} from "vuex"
import eventList from "@/components/event-list"
export default {
    head() {
        return {
            title: "Event Calendar"
        }
    },
    components: {
        eventList
    },
    data() {
        return {
            alert: false
        }
    },
    watch: {
        //TODO: access local / this properties issue when using arrow function
        //https://github.com/vuejs/vue-class-component/issues/103#issuecomment-307603925
        error: function (newValue, oldValue) {
            if(newValue)
            {
                this.alert = true
            }
        }
    },
    computed: {
        ...mapState(["auth", "loading", "error", "events"]),
        //TODO: sort events by date
        sortedEvents() {
            return this.events.sort((a, b) => {
                var dateA = a.date
                var dateB = b.date
                if(dateA < dateB) return -1
                if(dateA > dateB) return 1
                return 0
            }).filter(item => {
                return new Date(item.date) >= new Date()
            })
        }
    },
    mounted() {
        this.$store.state.appName = "Event Calendar"
        if(this.events.length == 0) this.$store.dispatch("loadEvents")
    },
    beforeDestroy() {
        this.$store.dispatch("setLoading", false)
    }
}