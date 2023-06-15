<template>
  <v-container>
    <todo-list></todo-list>
  </v-container>
</template>

<script>
import TodoList from "@/components/TodoList.vue";

export default {
  components: {
    TodoList,
  },
};
</script>

<style>
.v-main__wrap {
  background-color: rgb(255, 255, 255);
}

.theme--light.v-data-table {
  background-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
}

@media (min-width: 1264px) {
  .container {
    max-width: 1485px;
  }
}


@media (min-width: 2400px) {
  .container {
    max-width: 2500px;
  }
}
</style>
