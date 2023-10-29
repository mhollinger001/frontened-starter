<script setup lang="ts">
import VideoComponent from "@/components/SubLesson/VideoComponent.vue";
import ExerciseComponent from "@/components/SubLesson/ExerciseComponent.vue";

import router from '@/router';
import { fetchy } from '@/utils/fetchy';
import { onBeforeMount, ref } from 'vue';
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const loaded = ref(false);
const lesson = ref<Record<string, any>>({});
const { currentUsername } = storeToRefs(useUserStore());

async function getLesson() {
    const _id = router.currentRoute.value.params._id;
    if (Array.isArray(_id)) {
        throw new Error('too many IDs!')
    }
    try {
        lesson.value = await fetchy(`/api/lesson`, "GET", { query: { _id } });
    } catch(_) {
        return;
    }
}

onBeforeMount(async () => {
  await getLesson();
  loaded.value = true;
});
</script>

<template>
  <main>
    <section class="title" >
      <h1 v-if="loaded">{{ lesson.title }}
        <RouterLink v-if="currentUsername === lesson.author" :to="{ name: 'Edit Lesson', params: { _id: router.currentRoute.value.params._id }}">
          <button><img src="@/assets/images/pencil-solid.svg" width="25" height="25"/></button>
        </RouterLink>
      </h1>
      <h1 v-else>Loading...</h1>
    </section>
    <section class="subLessons" v-if="loaded && lesson.subLessons.length !== 0">
      <article v-for="subLesson, index in lesson.subLessons">
        <VideoComponent v-if="lesson.subLessonTypes[index] === 'video'" :title="subLesson.title" :videoUrl="subLesson.videoUrl"/>
        <ExerciseComponent v-else-if="lesson.subLessonTypes[index] === 'exercise'" :title="subLesson.title" :questions="subLesson.questions"/>
      </article>
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

a {
  color: white;
  text-decoration: none;
}

button {
  justify-content: center;
  background-color: rgb(255, 255, 255);
  border-radius: 25%;
  cursor: pointer;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  margin-bottom: 1em;
}

.subLessons {
  justify-content: space-between;
  margin: 0 auto;
}

section {
  margin: 0 auto;
  max-width: 80%;
  gap: 1em;
}

</style>
