<template>
  <v-container>
    <h1>Edit Event</h1>
    <v-layout row="">
      <v-flex xs12>
        <form @submit.prevent="updateEvent">
          <v-layout row>
            <v-flex xs12 md8>
              <v-text-field
              label="Title"
              v-model="title"
              :rules="[rules.required]"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex>
              <v-text-field
              label="Description"
              rows="2"
              v-model="desc"
              multi-line
              :rules="[rules.required]"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
              label="Location"
              prepend-icon="location_on"
              v-model="location"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs5>
              <v-menu
                ref="date"
                lazy
                :close-on-content-click="false"
                v-model="pickerDate"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
                :return-value.sync="date"
              >
                <v-text-field
                  slot="activator"
                  label="Select date"
                  prepend-icon="event"
                  v-model="date"
                  :rules="[rules.required]"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="date" :min="dateMin" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="pickerDate = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.date.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs5>
              <v-menu
                ref="time"
                lazy
                :close-on-content-click="false"
                v-model="pickerTime"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
                :return-value.sync="time"
              >
                <v-text-field
                  slot="activator"
                  label="Select time"
                  v-model="time"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker v-model="time" @change="$refs.time.save(time)"></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <v-text-field
              name="name"
              id="name"
              label="Image URL (paste from URL)"
              v-model="imageURL"
              required></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12>
              <img :src="imageURL" height="200">
            </v-flex>
          </v-layout>
          <br>
          <v-checkbox
            label="Lock from user to join this event"
            v-model="joinLocked"
            color="secondary"
          ></v-checkbox>
          <v-layout row>
            <v-flex>
              <v-btn flat class="error" type="submit">
                Update Event
              </v-btn>
              <v-btn flat class="secondary" :to="'/event/' + id">
                Cancel
              </v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
    <v-divider class="my-4"></v-divider>
    <h2 class="mb-2">Sponsors Logo</h2>
    <v-layout>
      <v-flex>
        <h4 v-if="loading">Loading...</h4>
        <div class="sponsors" v-for="item in sponsors" :key="item.key" v-if="!loading">
          <h4>{{item.name}}</h4>
          <div>
            <v-tooltip top>
                <v-icon @click.stop="openDialog(item)" :style="{cursor:'pointer'}" slot="activator">edit</v-icon>
                <span>Update Logo</span>
            </v-tooltip>
            <img :src="item.imageURL ? item.imageURL : '/images/sponsors/empty-logo-' + (Math.floor(Math.random() * 2) + 1) + '.jpg'" height="200">
          </div>
        </div>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" width="80%">
      <v-card v-if="sponsor">
        <v-card-text class="text-xs-center">
            <span>
                Update <b>{{sponsor.name}}</b>'s logo
            </span>
            <v-text-field
                class="mt-2"
                :style="{fontSize: '40px'}"
                label="Logo URL, from URL or upload"
                append-icon="add_a_photo"
                :append-icon-cb="pickPhoto"
                v-model="sponsorImageURL"
                type="text"
                hint="height max 100 pixels recommened"
            >
            </v-text-field>
            <input type="file" ref="imageUpload" style="display: none" accept="image/*" @change="onPhotoPicked">
            <v-text-field
                class="mt-2"
                :style="{fontSize: '40px'}"
                label="Tagline"
                v-model="sponsorTagline"
                type="text"
            >
            </v-text-field>
            <v-text-field
                class="mt-2"
                :style="{fontSize: '40px'}"
                label="Website URL"
                v-model="sponsorWebURL"
                type="text"
                hint="make sure begin with http:// or https://"
            >
            </v-text-field>
            <img :src="sponsorImageURL" width="150">
        </v-card-text>
        <v-card-actions class="text-xs-center">
            <v-layout row class="mb-2">
                <v-flex>
                    <v-btn
                        flat
                        class="error"
                        :disabled="loading"
                        @click.stop="updateSponsorImageURL(sponsor.key)"
                    >
                    {{ loading ? "updating..." : "Update" }}
                    </v-btn>
                    <v-btn
                        flat
                        class="secondary"
                        @click.stop="dialog = false"
                    >
                    Cancel
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {mapState} from "vuex"
import eventDetail from "@/mixins/event-detail"
export default {
    middleware: "auth",
    mixins: [eventDetail],
    head() {
        return {
            title: "Edit Event | " + this.title
        }
    },
    data() {
      return {
        pickerDate: false,
        pickerTime: false,
        rules: {
            required: (value) => {
              return !!value || "Required."
            }
        },
        sponsors: [],
        sponsor: null,
        sponsorImageURL: null,
        sponsorImageFile: null,
        sponsorTagline: null,
        sponsorWebURL: null,
        dialog: false
      }
    },
    computed: {
      ...mapState(["loading"]),
      dateMin(){
        var d = new Date();
        d.setDate(d.getDate() - 1) //yesterday
        return d.toISOString()
      }
    },
    watch: {
      sponsorImageURL: function(newValue, oldValue) {
        if(!newValue) return
        //avoid update from file load
        if(newValue.indexOf("data:image") == 0) return
        //reset file data
        this.sponsorImageFile = null
      }
    },
    methods: {
      updateEvent() {
        this.$store.dispatch("updateEvent", {
            id: this.id,
            title: this.title,
            desc: this.desc,
            location: this.location,
            date: this.date,
            time: this.time,
            imageURL: this.imageURL,
            joinLocked: this.joinLocked 
        })
        .then(() => {
            this.$router.push("/event/" + this.id)
        })
      },
      openDialog(sponsor) {
        this.sponsor = sponsor
        this.sponsorImageURL = sponsor.imageURL
        this.sponsorTagline = sponsor.tagline
        this.sponsorWebURL = sponsor.webURL
        this.dialog = true
      },
      updateSponsorImageURL(key) {
        this.$store.dispatch("updateSponsorLogo", {
          eventID:this.id, 
          key:key,
          imageURL: this.sponsorImageURL,
          imageFile: this.sponsorImageFile,
          tagline: this.sponsorTagline,
          webURL: this.sponsorWebURL
        })
        .then(imageURL => {
          this.dialog = false
          this.sponsors.map(item => {
            if(item.key == key) {
              item.imageURL = imageURL
              item.tagline = this.sponsorTagline
              item.webURL = this.sponsorWebURL
            }
            return item
          })
          this.sponsor = null
        })
        .catch(error => {
          console.log(error)
        })
      },
      pickPhoto() {
        this.$refs.imageUpload.click()
      },
      onPhotoPicked (e) {
        const files = e.target.files
        if(files.length == 0) return
        const filename = files[0].name
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
          this.sponsorImageURL = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.sponsorImageFile = files[0]
      }
    },
    mounted() {
        this.$store.state.appName = "Edit Event - " + this.title  
        this.$store.dispatch("loadSponsors", this.id)
        .then(data => {
            //short from biggest donation
            this.sponsors = data.sort((a, b) => {
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
</script>
<style lang="scss" scoped>
.sponsors {
  > div {
    position: relative;
    padding: 8px;
    margin: 6px 0;
    background-color: #eee;
    border: 1px dashed #ccc;
    display: inline-block;
    > .tooltip {
      position: absolute;
      top: 2px;
      right: 2px;
      .icon {
        font-size: 1.2em;
      }
    }
    > img {
      display: block;
      width: auto;
      height: 90px;
    }
  }
}
</style>
