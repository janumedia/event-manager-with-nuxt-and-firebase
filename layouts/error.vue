<template>
  <v-container>
      <v-layout row>
          <v-flex xs12 text-xs-center>
              <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>An error occured</h1>
        <br>
        <v-layout>
            <v-flex xs12 center>
                <v-btn flat to="/">Back</v-btn>
            </v-flex>
        </v-layout>
          </v-flex>
      </v-layout>
  </v-container>
</template>
<script>
export default {
    props: ["error"]
}
</script>
<style scoped>
</style>
