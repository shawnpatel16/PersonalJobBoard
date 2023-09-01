<template>
  <div class="card text-center btn btn-outline-light fixed-card" @click="handleClick">
    <div class="card-body">
      <!-- Header -->
      <div class="">
        <h5 class="font-weight-bold mb-0 text-wrap">
          {{ enumeration }}. {{ capitalizedCompanyName }}
        </h5>
      </div>

      <!-- Footer -->
      <div class="text-muted mt-2 pt-2">
        <span>Last visited: {{ lastVisited }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="pb-2">
      <button
        class="btn btn-outline-info me-2"
        data-bs-toggle="modal"
        :data-bs-target="'#' + modalTargetId"
        @click.stop="editBookmark"
      >
        Edit
      </button>
      <button class="btn btn-outline-danger" @click.stop="deleteBookmark">
        Delete
      </button>
    </div>
  </div>

  <div class="modal fade" :id="modalTargetId" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Edit Form Here -->
          <input v-model="editedName" class="form-control mb-2" />
          <input v-model="editedLink" class="form-control" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :data-bs-target="'#' + modalTargetId" @click="submitEdit">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["companyName", "link", "enumeration", "modalTargetId"], // Add this line to include the enumeration prop
  data() {
    return {
      lastVisited: null,
      editedName: this.companyName,
      editedLink: this.link,
    };
  },
  methods: {
    handleClick() {
      const newTab = window.open(this.link, "_blank");
      const now = new Date();
      const formattedDate = this.formatDate(now);
      localStorage.setItem(this.companyName, formattedDate);
      this.lastVisited = formattedDate;
    },
    formatDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are 0-indexed
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    },

submitEdit() {
    this.$emit('edit', {
      oldName: this.companyName,
      oldLink: this.link,
      newName: this.editedName,
      newLink: this.editedLink
    });
  },
    deleteBookmark() {
      // Trigger delete functionality (you can emit an event to the parent)
      console.log("deleting");
      this.$emit("delete", this.companyName, this.link);
    },
  },
  computed: {
    capitalizedCompanyName() {
      return (
        this.companyName.charAt(0).toUpperCase() + this.companyName.slice(1)
      );
    },
    modalTargetId() {
    return `editModal_${this.companyName.replace(/\s+/g, '_')}`;
  }
  },
  mounted() {
    const storedValue = localStorage.getItem(this.companyName);
    this.lastVisited = storedValue ? storedValue : "Not visited";
  },
};
</script>
<style scoped>
.fixed-card {
  width: 250px;  
  height: 200px;

}
</style>
