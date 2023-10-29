<script setup lang="ts">
import ExerciseComponent from "@/components/SubLesson/ExerciseComponent.vue";
import VideoComponent from "@/components/SubLesson/VideoComponent.vue";
import CreateVideoForm from "@/components/SubLesson/CreateVideoForm.vue";
import CreateExerciseForm from "@/components/SubLesson/CreateExerciseForm.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

interface subLesson {
  type: string;
  title: string;
  questions?: question[];
  videoUrl?: string;
}

interface question {
  question: string;
  answerType: string;
  answer: string;
}

const subLessons = ref<subLesson[]>([]);
const creating = ref("");
const lessonTitle = ref("");

function createExercise() {
  creating.value = "exercise";
}

function startCreatingVideo() {
  creating.value = "video";
}

function addVideoToSubLessons(title: string, videoUrl: string) {
  subLessons.value.push({ type: 'video', title, videoUrl });
  stopCreating();
}

function addExerciseToSubLessons(title: string, questions: question[]) {
  subLessons.value.push({ type: 'exercise', title, questions });
  stopCreating();
}

function stopCreating() {
  creating.value = "";
}

async function createLesson() {
  try {
    await fetchy("/api/lesson", "POST", {
      body: { 
        title: lessonTitle.value,
        subLessons: subLessons.value,
      },
    });
  } catch (_) {
    return;
  } 
}
</script>

<template>
  <main>
    <h1>Create a Lesson!</h1>
    <section>
      <article>
        <label for="LessonTitle">Lesson Title: </label>
        <input id="LessonTitle" v-model="lessonTitle" placeholder="Lesson Title">
      </article>
      </section>

    <section>
      <article v-for="subLesson, index in subLessons">
        <ExerciseComponent v-if="subLesson.type==='exercise'" :title="subLesson.title" :questions="subLesson.questions" :functional="false"/>
        <VideoComponent v-else-if="subLesson.type==='video'" :title="subLesson.title" :videoUrl="subLesson.videoUrl"/>
        <button @click="subLessons.splice(index, 1);">Remove SubLesson</button>
      </article>
    </section>

    <section>
      <article v-if="creating === 'exercise'">
        <CreateExerciseForm  @update="addExerciseToSubLessons" @cancel="stopCreating"/>
      </article>
      <article v-else-if="creating === 'video'">
        <CreateVideoForm  @update="addVideoToSubLessons" @cancel="stopCreating"/>
      </article>
      <menu v-else-if="creating === ''">
        <li><button @click="createExercise">Add Exercise</button></li>
        <li><button @click="startCreatingVideo">Add Video</button></li>
      </menu>
      <RouterLink v-if="creating === '' && subLessons.length > 0" :to="{ name: 'Home' }">
        <button @click="createLesson">Create Lesson!</button>
      </RouterLink>
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
  margin-bottom: 10px;
  max-width: 80%;
  gap: 1em;
  justify-content: center;
  align-items: center;
}

button {
    border-radius: 5px;
    padding: 0.2em 0.5em;
    margin-right: 1em;
}

#update {
    display: block;
    margin: 0.5em;
    margin-left: auto;
    margin-right: auto;
    font-size: x-large;
}

label {
  font-size: large;
}

h1 {
  text-align: center;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
</style>
