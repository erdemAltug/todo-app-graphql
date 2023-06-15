<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="itemsWithIndex"
      sort-by="index"
      class="elevation-8 mt-8"
    >
      <template v-slot:item.description="{ item }">
        <td class="description" @click="openDescriptionModal(item)">
          {{ item.description.slice(0, 20) + "..." }}
        </td>
      </template>

      <template v-slot:item.priority="{ item }">
        <v-chip :color="getColor(item.priority)" dark>
          {{ item.priority }}
        </v-chip>
      </template>

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Todo App</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <add-todo></add-todo>

          <v-dialog
            v-model="dialogUpdate"
            max-width="500px"
            persistent
            :retain-focus="false"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">Update Todo</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="title"
                        label="Todo Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="created_at"
                        label="Date"
                        readonly
                      ></v-text-field>
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
                        readonly
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="setUpdate(false)">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="updateTodoSubmit(deleted)"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="setDelete(false)"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteTodo(deleted)"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="descriptionModal" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >{{ descriptionTitle }} Description</v-card-title
              >
              <v-card-text>
                {{ description }}
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="updateTodoModal(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteModal(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import gql from "graphql-tag";
import AddTodo from "@/components/AddTodo.vue";
import UpdateTodo from "@/components/UpdateTodo.vue";
import { mapState, mapActions } from "vuex";

const GET_TODOS = gql`
  query getTodos {
    todos {
      title
      id
      description
      isDone
      created_at
      priority
    }
  }
`;

const UPDATE_TODOS = gql`
  mutation updateTodo(
    $id: Int!
    $isDone: String!
    $title: String!
    $description: String!
  ) {
    update_todos(
      where: { id: { _eq: $id } }
      _set: { isDone: $isDone, description: $description, title: $title }
    ) {
      affected_rows
    }
  }
`;

const DELETE_TODOS = gql`
  mutation removeTodo($id: Int!) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export default {
  components: {
    AddTodo,
    UpdateTodo,
  },

  data: () => ({
    descriptionModal: false,
    description: "",
    descriptionTitle: "",
    deleted: "",
    todos: [],
    title: "",
    created_at: "",
    isDone: "",
    priority: {},
    headers: [
      {
        text: "Index ",
        align: "start",
        sortable: false,
        value: "index",
      },
      { text: "Title", value: "title" },
      { text: "Desc", value: "description" },
      { text: "Status", value: "isDone" },
      { text: "Create Date", value: "created_at" },
      { text: "Priority", value: "priority" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  apollo: {
    todos: {
      query: GET_TODOS,
    },
  },

  computed: {
    ...mapState(["dialog", "dialogDelete", "dialogUpdate"]),

    itemsWithIndex() {
      return this.todos.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
  },

  methods: {
    ...mapActions(["setModal", "setDelete", "setUpdate"]),

    getColor(priority) {
      if (priority == "High") return "red";
      else if (priority == "Mid") return "orange";
      else return "green";
    },

    deleteModal(item) {
      this.setDelete(true);
      this.deleted = item.id;
    },

    updateTodoModal(item) {
      this.setUpdate(true);
      this.title = item.title;
      this.isDone = item.isDone;
      this.priority = item.priority;
      this.description = item.description;
      this.created_at = item.created_at;
      this.deleted = item.id;
    },

    updateTodoSubmit(id) {
      const { title, description, isDone } = this.$data;
      this.$apollo.mutate({
        mutation: UPDATE_TODOS,
        variables: {
          id,
          isDone,
          description,
          title,
        },
        refetchQueries: ["getTodos"],
      });
      this.setUpdate(false);
    },

    openDescriptionModal(item) {
      this.descriptionModal = true;
      this.description = item.description;
      this.descriptionTitle = item.title;
    },

    closeDescriptionModal() {
      this.descriptionModal = false;
    },

    deleteTodo(id) {
      this.setDelete(false);
      this.$apollo.mutate({
        mutation: DELETE_TODOS,
        variables: {
          id,
        },
        refetchQueries: ["getTodos"],
      });
    },
  },
};
</script>

<style>
.description {
  cursor: pointer;
}
</style>
