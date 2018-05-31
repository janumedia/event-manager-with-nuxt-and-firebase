<template>
    <div :class="'sponsors ' + type + '-sponsors'">
        <!--a href="#" target="_blank" :title="name"><img :src="imageURL ? imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" :alt="name"></a-->
        <a 
            :href="webURL ? webURL : '#'" target="_blank" 
            :title="tagline ? tagline : 'your logo'">
            <img 
            :src="imageURL ? imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" 
            :alt="tagline ? tagline : 'sponsorship'">
        </a>
    </div>
</template>
<script>
export default {
    props: ["type", "name", "imageURL", "tagline", "webURL"],
}
</script>
<style lang="scss" scoped>
.sponsors {
    display: inline-block;
    > a {
        img {
            display: inline-block;
            //-webkit-filter: grayscale(100%);
            //filter: grayscale(100%);
            padding: 0 6px;
        }
    }
}
.platinum-sponsors {
    > a {
        > img {
            height: 100px;
        }
    }
}
.gold-sponsors {
    > a {
        > img {
            height: 70px;
        }
    }
}
.silver-sponsors {
    > a {
        > img {
            height:50px;
        }
    }
}
.bronze-sponsors {
    > a {
        > img {
            height:40px;
        }
    }
}
</style>

