<template>
    <v-container>
        <h1>Event Manager</h1>
        <div class="fullWidth">
           <a :href="'event/' + activeEventID">
                <event-card
                    :isSingleCard="true"
                    :title="eventDetail.title"
                    :desc="eventDetail.desc"
                    :location="eventDetail.location"
                    :imageURL="eventDetail.imageURL"
                    :date="eventDetail.date"
                    :time="eventDetail.time"
                    :lat="eventDetail.lat"
                    :long="eventDetail.long"
                    :joinedCount="eventDetail.joinedCount"
                    >
                </event-card>
           </a>
        </div>
        <sponsors :eventID="activeEventID" showButton="true"/>
        <h3 class="subheading text-xs-center mb-4" v-if="hashtags.length > 0">
            Join Us on Instagram with hastag 
            <strong v-for="(hash, index) in hashtags" :key="index">
                #{{hash}}{{ hashtags.length-1 > index ? ", " : "" }}
            </strong>
        </h3>
        <insta-feed :hashtags="hashtags" v-if="hashtags.length > 0"/>
    </v-container>
</template>
<script>
import eventCard from "@/components/event-card"
import instaFeed from "@/components/insta-feed"
import sponsors from "@/components/sponsors"
export default {
    fetch({store}) {
        if(!store.state.config) {
            return store.dispatch("getConfig").then(res => {
                store.state.config = res
            })
            .catch(error => {
                console.log(error)
            })
        }
    },
    components: {
        eventCard, instaFeed, sponsors
    },
    data() {
        return { becameSponsor: false }
    },
    computed: {
        hashtags() {
            let obj = this.$store.state.config
            if(obj && obj.hashtags)
            {
                return Object.keys(obj.hashtags).map(key => obj.hashtags[key])
            }
            return []
        },
        activeEventID() {
            return this.$store.state.config.activeEventID
        },
        eventDetail() {
            return this.$store.state.config.eventDetail
        }
    },
    mounted() {
        this.$store.state.appName = "Home"
    }
}
</script>
<style lang="scss" scoped>
.text--center {
    text-align: center;
}
.fullWidth {
    width: 100%;
    text-align:center;
    margin-bottom: 20px;
    >img {
        width: 400px;
    }
}
a {
    text-decoration: none;
}
@media only screen and (max-width:500px) {
    .fullWidth {
        img {
            width: 100%;
        }
    }
}

.sponsors-container {
    margin: 30px;
}

.sponsors {
    margin: 12px 0;
    > a {
        img {
            //-webkit-filter: grayscale(100%);
            //filter: grayscale(100%);
            padding: 0 8px;
        }
    }
    > .btn {
        font-size: 11px;
        border-radius: 16px !important;
        //text-transform: none;
    }
    > div {
        margin-top: 16px;
        p {
            font-size: 12px;
            margin: 6px 0;
        }
    }
}
.gold-sponsors {
    > a {
        > img {
            height: 90px;
            //padding: 0 10px;
        }
    }
}
.silver-sponsors {
    > a {
        > img {
            height:50px;
            //padding: 0 8px;
        }
    }
}
.bronze-sponsors {
    > a {
        > img {
            height:40px;
            //padding: 0 8px;
        }
    }
}
</style>
