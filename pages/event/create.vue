<template>
  <v-container>
    <h1>Create New Event</h1>
    <v-layout row="">
      <v-flex xs12>
        <form @submit.prevent="createEvent">
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
              multi-line
              rows="2"
              v-model="desc"
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
                Create Event
              </v-btn>
              <v-btn flat class="secondary" to="/event">
                Cancel
              </v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
    middleware: "auth",
    head() {
        return {
            title: "Create New Event"
        }
    },
    data() {
      return {
        title: "Sayan Meetup",
        desc: "Meetup at Villa Taman Bebek Sayan",
        location: "Villa Taman Bebek, Sayan",
        date: "2018-06-18",
        time: "05:16",
        imageURL: "http://partners.baliwww.com/uploads/photos/1842.jpg",
        joinLocked: false,
        pickerDate: false,
        pickerTime: false,
        rules: {
            required: (value) => {
              return !!value || "Required."
            }
        }
      }
    },
    computed: {
      dateMin(){
        var d = new Date();
        d.setDate(d.getDate() - 1) //yesterday
        return d.toISOString()
      }
    },
    methods: {
      createEvent() {
        this.$store.dispatch("createEvent", {
          title: this.title,
          desc: this.desc,
          location: this.location,
          date: this.date,
          time: this.time,
          imageURL: this.imageURL,
          joinLocked: this.joinLocked
        })
        .then(() => {
          this.title = ""
          this.desc = ""
          this.location = ""
          this.date = ""
          this.time = ""
          this.imageURL = ""

          this.$router.push("/event")
        })
      }
    },
    mounted() {
        this.$store.state.appName = "Create Event"  
    }
    
}
</script>