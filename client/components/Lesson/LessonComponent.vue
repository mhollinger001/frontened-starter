<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["lesson"]);
const emit = defineEmits(["editLesson", "refreshLessons"]);
const { currentUsername } = storeToRefs(useUserStore());

</script>


<template>
  <RouterLink :to="{ name: 'Lesson', params: { _id: props.lesson._id } }">
    <h2 class="title">{{ props.lesson.title }}</h2>
    <div class="base">
      <article class="author">
        <p class="title">{{ props.lesson.author }}</p>
      </article>
      <article class="timestamp">
        <p v-if="props.lesson.dateCreated !== props.lesson.dateUpdated">Edited: {{ formatDate(props.lesson.dateUpdated) }}</p>
        <p v-else>Created: {{ formatDate(props.lesson.dateCreated) }}</p>
      </article>
    </div>
  </RouterLink>
</template>


<style scoped>
p {
  margin: 0em;
}

.title {
  text-align: center;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}


a {
  color: black;
  text-decoration: none;
}
</style>