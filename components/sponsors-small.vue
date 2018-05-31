<template>
    <div class="sponsors-container">
        <h2 class="subheading grey--text" v-if="sponsors.length > 0">Sponsors:</h2>
        <div class="text--center">
            <div class="sponsors platinum-sponsors" v-for="sponsor in platinumSponsors" :key="sponsor.key">
                <a 
                    :href="sponsor.webURL ? sponsor.webURL : '#'" target="_blank" 
                    :title="sponsor.tagline ? sponsor.tagline : 'your logo'">
                    <img 
                    :src="sponsor.imageURL ? sponsor.imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" 
                    :alt="sponsor.tagline ? sponsor.tagline : 'sponsorship'">
                </a>
            </div>
            <div class="sponsors gold-sponsors" v-for="sponsor in goldSponsors" :key="sponsor.key">
                <a 
                    :href="sponsor.webURL ? sponsor.webURL : '#'" target="_blank" 
                    :title="sponsor.tagline ? sponsor.tagline : 'your logo'">
                    <img 
                    :src="sponsor.imageURL ? sponsor.imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" 
                    :alt="sponsor.tagline ? sponsor.tagline : 'sponsorship'">
                </a>
            </div>
            <div class="sponsors silver-sponsors" v-for="sponsor in silverSponsors" :key="sponsor.key">
                <a 
                    :href="sponsor.webURL ? sponsor.webURL : '#'" target="_blank" 
                    :title="sponsor.tagline ? sponsor.tagline : 'your logo'">
                    <img 
                    :src="sponsor.imageURL ? sponsor.imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" 
                    :alt="sponsor.tagline ? sponsor.tagline : 'sponsorship'">
                </a>
            </div>
            <div class="sponsors bronze-sponsors" v-for="sponsor in bronzeSponsors" :key="sponsor.key">
                <a 
                    :href="sponsor.webURL ? sponsor.webURL : '#'" target="_blank" 
                    :title="sponsor.tagline ? sponsor.tagline : 'your logo'">
                    <img 
                    :src="sponsor.imageURL ? sponsor.imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" 
                    :alt="sponsor.tagline ? sponsor.tagline : 'sponsorship'">
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import sponsors from "@/mixins/sponsors"
export default {
    mixins: [sponsors]
}
</script>
<style lang="scss" scoped>
.text--center {
    text-align: center;
}
.sponsors-container {
    margin: 0 14px 14px;
    h2 {
        font-size: 0.8em !important;
        margin: 4px 0 10px;
    }
}
.sponsors {
    display: inline-block;
    > a {
        img {
            display: inline-block;
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
            padding: 0 6px;
            opacity: 0.7;
        }
        &:hover {
            img {
                -webkit-filter: grayscale(0%);
                filter: grayscale(0%);
                opacity: 1;
            }
        }
    }
}
.platinum-sponsors {
    > a {
        img {
            height: 70px;
        }
    }
}
.gold-sponsors {
    > a {
        img {
            height: 60px;
        }
    }
}
.silver-sponsors {
    > a {
        img {
            height: 48px;
        }
    }
}
.bronze-sponsors {
    > a {
        img {
            height: 32px;
        }
    }
}
</style>