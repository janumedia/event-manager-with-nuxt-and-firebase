<template>
  <v-container>
    <v-layout row>
        <v-flex>
            <v-alert 
                type="success" 
                dismissible v-model="alert"
                transition="scale-transition"
            >
            {{ message }}
            </v-alert>
            <v-alert 
                type="error" 
                dismissible v-model="error"
                transition="scale-transition"
            >
            {{ message }}
            </v-alert>
        </v-flex>
    </v-layout>
    <v-layout row="">
      <v-flex xs12>
          <v-card flat>
                <event-card
                    :isSingleCard="true"
                    :title="title"
                    :location="location"
                    :imageURL="imageURL"
                    :date="date"
                    :time="time"
                    :lat="lat"
                    :long="long"
                    :joinedCount="joinedCount"
                    >
                </event-card>
                <sponsors-small :eventID="id"/>
          </v-card>
      </v-flex>
    </v-layout>
    <v-divider class="my-4"></v-divider>
    <h2>Fill Personal Data</h2>
    <v-layout row="">
      <v-flex xs12>
        <form @submit.prevent="submit">
          <v-layout row>
            <v-flex xs8 sm4>
              <v-select
                label="Type your class name"
                :items="classList"
                v-model="className"
                autocomplete
                required
              >
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
                <v-text-field
                    label="Type your full name"
                    v-model="fullName"
                    required
                >
                </v-text-field>
            </v-flex>
            <v-flex xs4 class="ml-2">
                <v-btn flat class="secondary" :disabled="loading" @click.stop="verifyUser">
                    Verify
                </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row v-if="loading">
            <v-flex xs12>
                <h3>Verifying...</h3>
            </v-flex>
          </v-layout>
          
          <div>
              
            <v-layout row v-if="!hasJoined && user">
                <v-flex xs12>
                    <v-text-field
                        prepend-icon="home"
                        label="Address"
                        rows="2"
                        multi-line
                        v-model="address"
                        :disabled="disableJoin"
                        required
                    >
                    </v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row v-if="!hasJoined && user">
                <v-flex xs12 smd8>
                    <v-text-field
                        label="Phone"
                        prepend-icon="phone"
                        type="tel"
                        pattern="^[0-9\-\+\s\(\)]*$"
                        mask="####-###-########"
                        v-model="phone"
                        :disabled="disableJoin"
                        required
                    >
                    </v-text-field>
                </v-flex>
            </v-layout>
            
            <div v-if="!hasJoined && user">
                <h2 class="my-4">Fill Event Data</h2>
                <v-layout row class="mt-2">
                    <v-flex>
                        <v-switch
                            :label="(isGoing ? 'Going': 'Not going') + ' to venue'"
                            v-model="going"
                            color="secondary"
                            :disabled="disableJoin"
                        >
                        </v-switch>
                    </v-flex>
                </v-layout>
                <v-layout row v-if="isGoing">
                    <v-flex>
                        <v-switch
                            v-model="room"
                            color="secondary"
                            :disabled="disableJoin"
                        >
                            <div slot="label">Book a room <small>(IDR {{numFormat(rates.room)}}  / night)</small></div>
                        </v-switch>
                    </v-flex>
                </v-layout>
                <v-layout row v-if="isGoing">
                    <v-flex>
                        <v-switch
                            v-model="camp"
                            color="secondary"
                            :disabled="disableJoin"
                        >
                            <div slot="label">Use camp ground <small>(setup your own)</small></div>
                        </v-switch>
                    </v-flex>
                </v-layout>
                <v-layout row v-if="isGoing">
                    <v-flex>
                            <v-layout row>
                                <v-flex xs12 class="mt-2 mb-1">
                                    <span class="title grey--text">Number of extra person</span>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4 sm2>
                                    <v-text-field
                                        label="Adult"
                                        type="tel"
                                        pattern="^[0-9]*$"
                                        mask="#"
                                        v-model="adult"
                                        :disabled="disableJoin"
                                    >
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4 sm2>
                                    <v-text-field
                                        label="Child"
                                        type="tel"
                                        pattern="^[0-9]*$"
                                        mask="#"
                                        v-model="child"
                                        :disabled="disableJoin"
                                    >
                                    </v-text-field>
                                </v-flex>
                            </v-layout>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs12 sm6>
                        <v-text-field
                            label="Donation / Sponsorship"
                            type="tel"
                            pattern="^[0-9]*$"
                            suffix="rupiah"
                            v-model="donation"
                            :disabled="disableJoin"
                        >
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row class="text-xs-center">
                    <v-flex>
                        <img width="80%" :src="tshirtImgURL" data-pin-nopin="true">
                    </v-flex>
                </v-layout>
                <h2 class="my-2">Select T-Shirt</h2>
                <v-layout>
                    <v-flex>
                        <v-layout row>
                            <v-flex xs8 sm4>
                                <v-select
                                    label="Type Your T-Shirt size"
                                    :items="tshirtSizes"
                                    v-model="tshirt"
                                    :disabled="disableJoin"
                                    autocomplete
                                    required
                                >
                                </v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12 class="grey--text mt-2 mb-1">
                                <span class="title">Extra T-Shirt</span>
                                <h4>IDR {{numFormat(rates.extraTshirt)}} / pcs</h4>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="XXXL male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleXXXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="XXXL female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleXXXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="XXL male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleXXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="XXL female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleXXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="XL male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="XL female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleXL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="L male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="L female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleL"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="M male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleM"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="M female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleM"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 sm4>
                                <v-text-field
                                    label="S male"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="maleS"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex class="ml-5" xs6 sm4>
                                <v-text-field
                                    label="S female'"
                                    type="tel"
                                    pattern="^[0-9]*$"
                                    mask="#"
                                    suffix="pcs"
                                    v-model="femaleS"
                                    :disabled="disableJoin"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </div>
            
            <v-layout row class="mt-2">
                <v-flex xs12>
                    <v-btn flat :disabled="disableJoin" class="error" type="submit" v-if="reset && user">
                        Join Event
                    </v-btn>
                    <v-btn flat class="primary" @click.stop="showDialogCard = true" v-if="!reset && disableJoin && user">
                        Show Card
                    </v-btn>
                    <v-btn flat class="secondary" :to="'/event/' + id">
                        Cancel
                    </v-btn>
                </v-flex>
            </v-layout>

          </div>
        </form>
      </v-flex>
    </v-layout>
    <v-layout>
        <v-flex>
            <v-dialog v-model="apply" width="80%" persistent>
                <v-card>
                    <v-card-text class="text-xs-center">
                        <card-detail
                        :title="title"
                        :name="name"
                        :className="className"
                        :going="going"
                        :room="room"
                        :camp="camp"
                        :totalFormatted="totalFormatted"
                        :donation="donation"
                        :rates="rates"
                        :adult="adult"
                        :child="child"
                        :selectedTshirtLabel="selectedTshirtLabel"
                        :totalTshirts="totalTshirts"
                        :extraTshirts="extraTshirts"
                        >
                        </card-detail>
                    </v-card-text>
                    <v-card-actions class="text-xs-center">
                        <v-layout row class="mb-2">
                            <v-flex>
                                <v-btn
                                    flat
                                    class="primary"
                                    @click.stop="joinEvent"
                                    :disabled="loading"
                                >
                                OK
                                </v-btn>
                                <v-btn
                                    flat
                                    class="secondary"
                                    @click.stop="apply = false"
                                    :disabled="loading"
                                >
                                Cancel
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showDialogCard" width="80%" persistent>
                <v-card>
                    <v-card-text class="text-xs-center">
                        <v-text-field
                            class="mt-2"
                            :style="{fontSize: '40px'}"
                            label="Type phone number"
                            type="tel"
                            pattern="^[0-9\-\+\s\(\)]*$"
                            mask="####-###-########"
                            ref="phoneNumber"
                        >
                        </v-text-field>
                    </v-card-text>
                    <v-card-actions class="text-xs-center">
                        <v-layout row class="mb-2">
                            <v-flex>
                                <v-btn
                                    flat
                                    class="primary"
                                    @click.stop="verifyUserPhone"
                                    ref="verifyUserPhoneBtn"
                                >
                                OK
                                </v-btn>
                                <v-btn
                                    flat
                                    class="secondary"
                                    @click.stop="showDialogCard = false"
                                >
                                Cancel
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import {mapState} from "vuex"
import card from "@/mixins/card"
import eventDetail from "@/mixins/event-detail"
import sponsorsSmall from "@/components/sponsors-small"
export default {
    components: {
        sponsorsSmall
    },
    mixins: [card, eventDetail],
    head() {
        return {
            title: this.title
        }
    },
    data() {
      return {
        //classList: ["F1", "F2", "F3", "B1", "B2", "S1", "S2"],
        user: null,

        name: null,
        fullName: null,
        className: null,
        address: "",
        phone: "",
        verifiedUser: false,

        cardKey: null,
        going: true,
        room: false,
        camp: false,
        adult: null,
        child: null,
        
        donation: null,
        
        tshirt: null,
        
        maleXXXL: null,
        maleXXL: null,
        maleXL: null,
        maleL: null,
        maleM: null,
        maleS: null,
        femaleXXXL: null,
        femaleXXL: null,
        femaleXL: null,
        femaleL: null,
        femaleM: null,
        femaleS: null,
        
        reset: true,
        hasJoined: true,
        message: "",
        alert: false,
        error: false,
        apply: false,
        showDialogCard: false,
        card: false,
        rules: {
            required: (value) => {
              return !!value || "Required."
            }
        }
      }
    },
    computed: {
        ...mapState(["classList", "loading"]),
        isGoing() {
            //reset value
            this.resetInput()
            return this.going
        },
        disableJoin() {
            return this.hasJoined
        },
        cardURL() {
            return "/card/" + this.id + "/" + this.cardKey
        },
        tshirtImgURL() {
            if(this.tshirt && this.tshirt.indexOf("female") > -1) return "/images/t-shirt-f.svg"
            return "/images/t-shirt-m.svg"
        }
    },
    
    watch: {
        //TODO: access local / this properties issue when using arrow function
        //https://github.com/vuejs/vue-class-component/issues/103#issuecomment-307603925
        className: function(newValue, oldValue) {
            this.user = null
        }
    },
    methods: {
        verifyUser() {
            this.user = null
            this.alert = false
            this.error = false
            this.$store.dispatch("verifyUser", {className: this.className, fullName: this.fullName, eventID: this.id})
            .then(data => {
                this.name = data.name
                this.className = data.className
                this.address = data.address
                this.phone = data.phone
                this.user = data
                if(data.registered)
                {
                    this.hasJoined = true
                    this.reset = false
                    this.cardKey = data.key
                    this.going = data.going
                    this.room = data.room
                    this.camp = data.camp
                    this.adult = data.adult
                    this.child = data.child
                    this.donation = data.donation
                    this.tshirt = data.tshirt
                    this.maleXXXL = data.maleXXXL
                    this.maleXXL = data.maleXXL
                    this.maleXL = data.maleXL
                    this.maleL = data.maleL
                    this.maleM = data.maleM
                    this.maleS = data.maleS
                    this.femaleXXXL = data.femaleXXXL
                    this.femaleXXL = data.femaleXXL
                    this.femaleXL = data.femaleXL
                    this.femaleL = data.femaleL
                    this.femaleM = data.femaleM
                    this.femaleS = data.femaleS
                } else 
                {
                    this.hasJoined = false
                    this.reset = true
                    this.cardKey = null
                    this.going = true
                    this.donation = null
                    this.resetInput()
                }
            })
            .catch(error => {
                window.scrollTo(0, 0)
                this.message = error
                this.error = true
                
                this.user = null
                this.address = null
                this.phone = null
                this.hasJoined = true
                this.reset = true
                this.cardKey = null
                this.going = true
                this.donation = null
                this.resetInput()
            })
        },
        verifyUserPhone() {
            this.$refs.verifyUserPhoneBtn.$el.innerText = "verifying..."
            this.$refs.verifyUserPhoneBtn.$el.disabled = true
            this.$store.dispatch("verifyUserPhone", {key: this.user.id, phone: this.$refs.phoneNumber.inputValue})
            .then(() => {
                this.$router.push(this.cardURL)
            })
            .catch(error => {
                console.log(error)
                window.scrollTo(0, 0)
                this.message = error
                this.error = true
                this.showDialogCard = false
                this.$refs.phoneNumber.inputValue = ""
                this.$refs.verifyUserPhoneBtn.$el.innerText = "Ok"
                this.$refs.verifyUserPhoneBtn.$el.disabled = false
            })
        },
        resetInput() {
            this.room = this.camp = false
            this.adult = this.child = null
            this.tshirt = null
            this.maleXXXL = this.maleXXL = this.maleXL = this.maleL = this.maleM = this.maleS = null
            this.femaleXXXL = this.femaleXXL = this.femaleXL = this.femaleL = this.femaleM = this.femaleS = null
        },
        submit() {
            this.alert = false
            if(!this.tshirt)
            {
                window.scrollTo(0, 0)
                this.message = "Please select your T-Shirt Size"
                this.error = true
                return;
            }
            this.apply = true
        },
        joinEvent() {
            this.user.address = this.address
            this.user.phone = this.phone
            this.$store.dispatch("joinEvent", {
                eventID: this.id,
                id: this.user.id,
                name: this.name,
                className: this.className,
                address: this.address,
                phone: this.phone,
                going: this.going,
                room: this.room,
                camp: this.camp,
                adult: this.calculate(this.adult),
                child: this.calculate(this.child),
                donation: this.calculate(this.donation),
                tshirt: this.tshirt,
                maleXXXL: this.calculate(this.maleXXXL),
                maleXXL: this.calculate(this.maleXXL),
                maleXL: this.calculate(this.maleXL),
                maleL: this.calculate(this.maleL),
                maleM: this.calculate(this.maleM),
                maleS: this.calculate(this.maleS),
                femaleXXXL: this.calculate(this.femaleXXXL),
                femaleXXL: this.calculate(this.femaleXXL),
                femaleXL: this.calculate(this.femaleXL),
                femaleL: this.calculate(this.femaleL),
                femaleM: this.calculate(this.femaleM),
                femaleS: this.calculate(this.femaleS)
            })
            .then(data => {
                window.scrollTo(0, 0)
                this.hasJoined = true
                this.cardKey = data
                this.message = "Congratulations, You just joined " + this.title
                this.alert = true
                this.apply = false
                this.reset = false
            })
        },
        calculate(item) {
            return item && item !== "" ? parseInt(item) : null
        }
    }
}
</script>