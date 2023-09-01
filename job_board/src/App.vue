<script>
import axios from "axios";
import BookmarkCard from "./components/BookmarkCard.vue";


export default {
  data() {
    return {
      showAddModal: false,
      linkText: "",
      bookmarks: [],
      showEditModal: false,
      editedName: "",
      editedLink: "",
      oldName: "",
      oldLink: "",
      searchTerm: "",
      currentIndex: 0,
    };
  },
  components: {
    BookmarkCard,
  },
  methods: {
    async submitLinks() {
      const linksArray = this.linkText.split("\n");
      const filteredLinks = linksArray.filter((link) => link.trim() !== "");
      console.log("sending links");

      try {
        const response = await axios.post(
          "http://localhost:3000/api/companies",
          {
            links: filteredLinks,
          }
        );
        console.log("sent links");

        // Handle successful response
        console.log("Links added:", response.data);

        // Hide modal and reset linkText
this.linkText = "";
        this.fetchCompanies();
      } catch (error) {
        // Handle error
        console.error("An error occurred while adding links:", error);
      }
    },
    handlePaste(event) {
      if (this.showAddModal) {
        event.preventDefault(); // Prevent browser's default paste operation
        const textarea = this.$refs.linkTextarea;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        // Get pasted data
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData("Text");

        // Update textarea value
        this.linkText = [
          this.linkText.slice(0, startPos),
          pastedData,
          "\n", // Add a new line
          this.linkText.slice(endPos),
        ].join("");

        // Update cursor position to new line
        textarea.selectionStart = textarea.selectionEnd =
          startPos + pastedData.length + 1;
      }
    },
    async fetchCompanies() {
      try {
        const response = await axios.get("http://localhost:3000/api/companies");
        this.bookmarks = response.data; // make sure you have bookmarks in your data object
        console.log("Fetched companies:", response.data);
      } catch (error) {
        console.error("An error occurred while fetching companies:", error);
      }
    },
    showEditModalFunction(companyName, link) {
      this.showEditModal = true;
      this.editedName = companyName;
      this.editedLink = link;
      this.oldName = companyName;
      this.oldLink = link;
    },
  async submitEdit(payload) {
    const { oldName, oldLink, newName, newLink } = payload;
    const response = await axios.put("http://localhost:3000/api/companies", {
      oldName,
      oldLink,
      newName,
      newLink
    });
    this.fetchCompanies(); // Refresh the list
  },
    async deleteBookmarkFunction(companyName, link) {
      const response = await axios.delete(
        `http://localhost:3000/api/companies/${companyName}`,
        {
          data: {
            link: link,
          },
        }
      );
      console.log(response);
      this.fetchCompanies(); // Refresh the list
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    calculateIndex(letter, bookmark) {
      let index = 1;
      for (const alphabet of this.alphabetIndex) {
        if (alphabet === letter) {
          for (const b of this.groupedBookmarks[alphabet]) {
            if (b.companyName === bookmark.companyName) {
              return index;
            }
            index++;
          }
        } else {
          index += this.groupedBookmarks[alphabet].length;
        }
      }
      return "N/A"; // This should never happen if the data is consistent
    },
    handleLinkClick(companyName) {
      const lastVisited = new Date().toISOString();
      localStorage.setItem(`lastVisited_${companyName}`, lastVisited);
      // Your code to navigate to the link
    },
    handleAlphabetClick(letter) {
      console.log(this.$refs);
      console.log(letter)
      if (this.$refs[letter] && this.$refs[letter][0]) {
        console.log("Scrolling to: ", this.$refs[letter][0]);

        this.$refs[letter][0].scrollIntoView();
      }
    },
  },
  mounted() {
    this.fetchCompanies();
    // Listen to paste event on the document
    document.addEventListener("paste", this.handlePaste);
  },
  beforeDestroy() {
    // Remove event listener
    document.removeEventListener("paste", this.handlePaste);
  },
  computed: {
    displayedBookmarks() {
      if (this.searchTerm) {
        // If searchTerm exists, filter bookmarks based on it
        return this.bookmarks.filter((bookmark) =>
          bookmark.companyName
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      } else {
        // If searchTerm doesn't exist, sort bookmarks alphabetically
        return [...this.bookmarks].sort((a, b) =>
          a.companyName.localeCompare(b.companyName)
        );
      }
    },
    groupedBookmarks() {
      return this.displayedBookmarks.reduce((acc, bookmark) => {
        const firstLetter = bookmark.companyName.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(bookmark);
        return acc;
      }, {});
    },
    alphabetIndex() {
      return Object.keys(this.groupedBookmarks).sort();
    },
  },
};
</script>

<template>
  <div class="main-container mb-4">
    <!-- Add Button -->
    <button class="btn btn-primary mb-4" data-bs-toggle="modal" data-bs-target="#addModal">
      Insert New Company
    </button>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <input
          type="text"
          class="form-control"
          v-model="searchTerm"
          placeholder="Search..."
        />
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog  modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Insert Company Links</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="showAddModal = false"></button>
          </div>
          <div class="modal-body">
            <textarea ref="linkTextarea" v-model="linkText" class="form-control"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" data-target="addModal" @click="submitLinks">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- Alphabetical index -->
      <div class="alphabetical-index">
  <span v-for="letter in alphabetIndex" 
        :key="letter" 
        @click="$refs[letter][0].scrollIntoView()"
        class="alphabet-button text-center btn btn-outline-primary"
        >
    {{ letter }}
  </span>
</div>

      <!-- Bookmarks -->
      <div>
        <div v-for="letter in alphabetIndex" :key="letter">
          <h2 class="mb-2" :ref="letter">{{ letter }}</h2>
          <div class="bookmarks-row mb-4">
            <div
              v-for="bookmark in groupedBookmarks[letter]"
              :key="bookmark.companyName"
            >
              <BookmarkCard
                :companyName="bookmark.companyName"
                :link="bookmark.link"
                :enumeration="calculateIndex(letter, bookmark)"
                :modalTargetId="'editModal_' + bookmark.companyName"
                @edit="submitEdit"
                @delete="deleteBookmarkFunction"
              />
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
  <button @click="scrollToTop" class="btn btn-outline-primary" style="position: fixed; top: 20px; right: 20px">
    Top
  </button>
</template>

<style scoped>
.main-container {
  margin-top: 20px;
  text-align: center;
}
.add-button {
  margin-bottom: 16px;
}
.action-bar {
  margin-bottom: 16px;
}
.alphabetical-index {
  margin-bottom: 16px;
}

.bookmarks-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Center the cards horizontally */
  gap: 16px; /* Gap between cards */
}

.bookmark-card {
  flex: 1;
  min-width: calc(20% - 16px); /* 5 cards per row, considering 16px gap */
  box-sizing: border-box;
}

</style>
