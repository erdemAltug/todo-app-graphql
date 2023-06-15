<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" @click="openModal">
        Add Todo
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Todo</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="title" label="Todo Name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="created_at" label="Date"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="isDone"
                label="Status ( Is Done )"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                v-model="description"
                label="Description"
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-select
                v-model="priority"
                label="Priority"
                :items="['High', 'Mid', 'Low']"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeModal"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="submit"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";
import { mapState, mapActions } from "vuex";

const ADD_TODO = gql`
  mutation InsertTodos(
    $title: String
    $description: String
    $isDone: String
    $created_at: date
    $priority: String
  ) {
    insert_todos(
      objects: {
        title: $title
        description: $description
        isDone: $isDone
        created_at: $created_at
        priority: $priority
      }
    ) {
      affected_rows
      returning {
        id
        isDone
        description
        title
        created_at
        priority
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation removeTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export default {
  name: "AddMovie",
  data() {
    return {
      priority: "",
      todos: [],
      title: "",
      description: "",
      isDone: "",
      created_at: "",
    };
  },
  apollo: {},

  computed: {
    ...mapState(["dialog", "dialogDelete"]),
  },

  created() {
    this.getTodayDate();
  },

  methods: {
    ...mapActions(["setModal"]),

    getTodayDate() {
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${year}-0${month}-${day}`;
      this.created_at = currentDate;
    },

    submit(e) {
      this.setModal(false);
      e.preventDefault();
      const { title, description, isDone, created_at, priority } = this.$data;
      this.$apollo.mutate({
        mutation: ADD_TODO,
        variables: {
          title,
          description,
          isDone,
          created_at,
          priority,
        },
        refetchQueries: ["getTodos"],
      });
    },

    deleteTodo(id) {
      this.$apollo.mutate({
        mutation: DELETE_TODO,
        variables: {
          id,
        },
        refetchQueries: ["getTodos"],
      });
    },

    openModal() {
      this.setModal(true);
    },

    closeModal() {
      this.setModal(false);
    },
  },
};
</script>
