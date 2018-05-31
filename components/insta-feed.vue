<template>
    <v-layout>
        <v-flex xs12 class="tile-container">
            <div class="tile">
                <div v-for="(item, index) in instaFeed" :key="index">
                    <a :href="'https://www.instagram.com/p/' + item.shortCode" target="_blank"><img :data-src="'/images/image-placeholder.svg'" :src="item.thumbURL" data-pin-nopin="true"></a>
                </div>
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from "axios"
export default {
    props: ["hashtags"],
    data() {
        return {
            instaList: [],
        }
    },
    computed: {
        instaFeed: function(){
            return this.instaList
        }
    },
    methods: {
        getInstaFeed(index) {
            index = index || 0
            let hash = this.hashtags[index]
            axios.get("https://www.instagram.com/explore/tags/" + hash + "/?__a=1")
            .then(res => {
                let list = res.data.graphql.hashtag.edge_hashtag_to_media.edges
                list.map(item => {
                    //avoid duplication
                    let found = this.instaList.find(i => i.shortCode == item.node.shortcode)
                    if(!found) {
                        this.instaList.push({
                            shortCode: item.node.shortcode,
                            thumbURL: item.node.thumbnail_resources[2].src
                        })
                    }
                })

                if(index < this.hashtags.length - 1) this.getInstaFeed(index + 1)
            })
            .catch(error => {
                if(index < this.hashtags.length - 1) this.getInstaFeed(index + 1)
            })
        }
    },
    mounted(){
        this.getInstaFeed()
    }
}
</script>
<style lang="scss" scoped>
/// reference : https://codepen.io/davidmars/pen/zBzWrZ
$spacing: 20px;
$padding: 10px;
$columns: 4;

.tile-container {
  margin: 0 auto;
  padding-top: $spacing;
  padding-left: $spacing;
  >.tile {
    column-count: $columns;
    column-gap: 0px;
    column-fill: balance;
    position: relative;
    //each item in the list
    >* {
      //display: inline-block;
      //break inside issue: https://css-tricks.com/almanac/properties/b/break-inside/
      page-break-inside: avoid;
      break-inside: avoid;
      //this is cosmetic now...
      font-size: 12px;
      color: #333;
      background-color: #fff;
      padding: $padding;
      margin-bottom: $spacing;
      margin-right: $spacing;
      border: 1px solid #ccc;
      >a {
        >img {
            width: 100%;
            height: auto;
            margin: 5px 0px;
            display: block;
        }
      }
      >*:first-child {
        margin-top: 0;
      }
      >*:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media only screen and (max-width:800px) {
    .tile-container {
        >.tile {
            column-count: 3;
        }
    }
}
@media only screen and (max-width:600px) {
    .tile-container {
        >.tile {
            column-count: 2;
        }
    }
}
@media only screen and (max-width:414px) {
    .tile-container {
        padding: 0;
        >.tile {
            column-count: 1;
            >* {
                width: 100%;
            }
        }
    }
}
</style>

