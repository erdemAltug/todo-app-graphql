<template>

</template>

<script>
import gql from "graphql-tag";
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

export default {
  name: "UpdateTodo",

  props: {
    tododata: {
      type: [Array, Object],
      required: true,
    },
    id: {
      type: Number,
    },
  },

  data() {
    return {
      priority: "",
      todos: this.tododata,
      title: "",
      description: "",
      isDone: "",
      created_at: "",
    };
  },
  apollo: {
    todos: {
      query: GET_TODOS,
    },
  },

  computed: {
    ...mapState(["dialog", "dialogDelete"]),
  },

  watch: {
    todos() {
      console.log("todos:", this.todos);
    },
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

    updateTodo(id) {
      this.setModal(true);
      console.log(this.todos);
      console.log(id);
      console.log(this.todos.find((todo) => todo.id === id).title);
      this.title = this.todos.find((todo) => todo.id === id).title;
    },

    // getTodoById(id) {
    //   this.$apollo.mutate({
    //     mutation: UPDATE_TODO,
    //     variables: {
    //       id,
    //     },
    //     refetchQueries: ["getTodos"],
    //   });
    //   console.log("item", this.todos);
    // },

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
