<template>
    <div class="sponsors-container text--center">
        <h2 class="subheading grey--text" v-if="platinumSponsors.length > 0">Platinum Sponsors</h2>
        <sponsor-logo
            v-for="sponsor in platinumSponsors" :key="sponsor.key"
            type="platinum" :name="sponsor.name" :imageURL="sponsor.imageURL" :tagline="sponsor.tagline" :webURL="sponsor.webURL"
        />
        <h2 class="subheading grey--text" v-if="goldSponsors.length > 0">Gold Sponsors</h2>
        <sponsor-logo
            v-for="sponsor in goldSponsors" :key="sponsor.key"
            type="gold" :name="sponsor.name" :imageURL="sponsor.imageURL" :tagline="sponsor.tagline" :webURL="sponsor.webURL"
        />
        <h2 class="subheading grey--text" v-if="silverSponsors.length > 0">Silver Sponsors</h2>
        <sponsor-logo
            v-for="sponsor in silverSponsors" :key="sponsor.key"
            type="silver" :name="sponsor.name" :imageURL="sponsor.imageURL" :tagline="sponsor.tagline" :webURL="sponsor.webURL"
        />
        <h2 class="subheading grey--text" v-if="bronzeSponsors.length > 0">Bronze Sponsors</h2>
        <sponsor-logo
            v-for="sponsor in bronzeSponsors" :key="sponsor.key"
            type="bronze" :name="sponsor.name" :imageURL="sponsor.imageURL" :tagline="sponsor.tagline" :webURL="sponsor.webURL"
        />
        <div class="sponsors grey--text text--center" v-if="showButton">
            <v-btn outline color="grey" @click.stop="becameSponsor = !becameSponsor">Become a Sponsor!</v-btn>
            <div v-if="becameSponsor">
                Register the event and fill donation:
                <p><strong>Platinum Sponsor</strong>: start at IDR <strong>{{ numFormat(platinumMinLimit) }}</strong></p>
                <p><strong>Gold Sponsor</strong>: start at IDR <strong>{{ numFormat(goldMinLimit) }}</strong></p>
                <p><strong>Silver Sponsor</strong>: start at IDR <strong>{{ numFormat(silverMinLimit) }}</strong></p>
                <p><strong>Bronze Sponsor</strong>: start at IDR <strong>{{ numFormat(bronzeMinLimit) }}</strong></p>
            </div>
        </div>
    </div>
</template>
<script>
import sponsorLogo from "@/components/sponsor-logo"
import sponsors from "@/mixins/sponsors"
import utils from "@/mixins/utils"
export default {
    components: {
        sponsorLogo
    },
    mixins: [sponsors, utils],
    props: ["showButton"],
    data() {
        return { 
            becameSponsor: false
        }
    }
}
</script>
<style lang="scss" scoped>
.text--center {
    text-align: center;
}
.sponsors-container {
    margin: 20px;
    h2 {
        margin: 10px 0;
    }
}
.sponsors {
    > div {
        margin-top: 16px;
        p {
            font-size: 12px;
            margin: 6px 0;
        }
    }
}
.btn {
    font-size: 11px;
    margin-top: 16px;
    border-radius: 16px !important;
    //text-transform: none;
}
</style>
