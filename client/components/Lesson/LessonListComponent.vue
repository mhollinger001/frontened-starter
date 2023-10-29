<script setup lang="ts">
import LessonComponent from "@/components/Lesson/LessonComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
// import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let lessons = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getLessons(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let lessonResults;
  try {
    lessonResults = await fetchy("/api/lessons", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  lessons.value = lessonResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getLessons();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchAuthor">Lessons:</h2>
    <h2 v-else>Lessons by {{ searchAuthor }}:</h2>
    <!-- <SearchPostForm @getPostsByAuthor="getPosts" /> -->
  </div>
  <section class="lessons" v-if="loaded && lessons.length !== 0">
    <article v-for="lesson in lessons" :key="lesson._id">
      <LessonComponent v-if="editing !== lesson._id" :lesson="lesson" @refreshLessons="getLessons" @editLesson="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

section {
  display:grid;
  grid-template-columns: auto auto auto;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  columns: 3;
}

.lessons {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
