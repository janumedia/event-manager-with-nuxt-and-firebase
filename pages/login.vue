<template>
    <v-container>
        <v-layout row>
            <v-flex>
                <v-alert 
                    type="error" 
                    dismissible v-model="alert"
                    transition="scale-transition"
                >
                {{ error ? error.message : "" }}
                </v-alert>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <form @submit.prevent="onLogin">
                                <v-layout row>
                                    <v-flex>
                                        <v-text-field
                                        name="email"
                                        label="Email"
                                        id="email"
                                        v-model="email"
                                        autocomplete="off"
                                        :rules="[rules.required, rules.email]">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex>
                                        <v-text-field
                                        name="password"
                                        label="Password"
                                        id="password"
                                        type="password"
                                        v-model="password"
                                        :rules="[rules.required]">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        <v-btn
                                        type="submit">
                                            Login
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            alert: false,
            email: "",
            password: "",
            rules: {
                required: (value) => !!value || "Required.",
                email: (value) => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                }
            }
        }
    },
    computed: {
       error() {
            var result = this.$store.state.error
            if(result) {
                switch(result.code)
                {
                    case "auth/user-not-found":
                    case "auth/invalid-email":
                        document.getElementById("email").focus()
                        break
                    case "auth/wrong-password":
                        document.getElementById("password").focus()
                        break
                }
            }
            return result
        }
    },
    methods: {
        onLogin() {
            this.alert = false
            this.$store.dispatch("login", { email: this.email, password: this.password })
            .then(() => {
                this.$router.go(-1)
                this.email = ""
                this.password = ""
            })
            .catch(() => {
                this.alert = true
            })
        }
    },
    mounted() {
        this.$store.state.appName = "Login"
    }
}
</script>
