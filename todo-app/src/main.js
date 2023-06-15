import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import VueApollo, { ApolloProvider } from "vue-apollo";
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false;

const httpLink = new HttpLink({
  uri: "https://vital-airedale-92.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "P7OEEmLatrZy7Ue9sAws7wovsrGuZlp35ODYoH52pZoSgo8gpLakI3Vw3qhAPh4d",
  },
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  store,
  apolloProvider,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
