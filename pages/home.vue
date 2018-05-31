<template>
  <v-container>
    <h1>Welcome Bro and Sista!!!</h1>
        <v-layout row class="mt-4">
            <v-icon>play_arrow</v-icon>
            <v-btn flat lighten to="/event">See event calendar</v-btn>
        </v-layout>
  </v-container>
</template>
<script>
export default {
  middleware: "auth",
  mounted() {
      this.$store.state.appName = "Home"
  } 
}
</script>