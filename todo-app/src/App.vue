<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h1>Altug Erdem</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="http://www.erdemaltug.com/"
        target="_blank"
        text
      >
        <span class="mr-2">And More</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
