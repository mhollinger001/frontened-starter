<script setup lang="ts">
import ExerciseComponent from "@/components/SubLesson/ExerciseComponent.vue";
import VideoComponent from "@/components/SubLesson/VideoComponent.vue";
import CreateVideoForm from "@/components/SubLesson/CreateVideoForm.vue";
import CreateExerciseForm from "@/components/SubLesson/CreateExerciseForm.vue";
import router from '@/router';
import { fetchy } from '@/utils/fetchy';
import { onBeforeMount, ref } from 'vue';

const loaded = ref(false);
const lesson = ref();
const editing = ref(-1);


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

async function updateVideo(_id: string, title: string, videoUrl: string) {
    editing.value = -1
    loaded.value = false;
    try {
        await fetchy(`/api/video`, "PATCH", { query: { _id }, body: { update: { title, videoUrl }}});
    } catch(_) {
        loaded.value = true;
        return;
    }
    await getLesson();
    loaded.value = true;
}

async function updateExercise(_id: string, title: string, questions: any[]) {
    editing.value = -1;
    loaded.value = false;
    let exercise;
    for (const subLesson of lesson.value.subLessons) {
        if (subLesson._id === _id) {
            exercise = subLesson;
            break;
        }
    }
    console.log('exercise found',exercise);
    for (const question of exercise.questions) {
        try {
            await fetchy(`/api/question`, "DELETE", { query: { _id: question._id }});
            console.log('question deleted', question)
        } catch(_) {
            continue;
        }
    }
    const newQuestionsIds = [];
    for (const question of questions) {
        try {
            console.log('trying to make question', {...question})
            const newQuestion = await fetchy(`/api/question`, "POST", { query: { ...question }});
            console.log('question made', newQuestion);
            newQuestionsIds.push(newQuestion.question._id);
        } catch(e) {
            console.log(e);
            continue;
        }
    }

    try {
        await fetchy(`/api/exercise`, "PATCH", { query: { _id }, body: { update: { title, questions: newQuestionsIds }}});
        console.log('exercise updated');
    } catch(_) {
        return
    }

    await getLesson();
    loaded.value = true;
}

function getQuestions(questions: any) {
    return questions.map((questionDoc: any) => {
        const { question, answerType, answer, ...rest } = questionDoc;
        return { question, answerType, answer };
    })
}

async function removeSubLesson(index: number) {
    editing.value = -1;
    loaded.value = false;
    const _id = lesson.value.subLessons[index]._id;
    try {
        if (lesson.value.subLessonTypes[index] === 'exercise') {
            await fetchy(`/api/exercise`, "DELETE", { query: { _id }});
        } else {
            await fetchy(`/api/video`, "DELETE", { query: { _id }});
        }
        await fetchy(`/api/lesson/remove`, "PATCH", { query: { _id: lesson.value._id, index: index.toString() }});
    } catch(e) {
        console.log(e)
        loaded.value = true;
        return;
    }
    await getLesson();
    loaded.value = true;
}

onBeforeMount(async () => {
  await getLesson();
  loaded.value = true;
});
</script>

<template>
    <main>
        <p v-if="!loaded">Loading...</p>
        <section>
            <RouterLink :to="{ name: 'Lesson', params: { _id: router.currentRoute.value.params._id } }">
                <button id="update">Update Lesson</button>
            </RouterLink>
        </section>
        <section>
            <article v-if="loaded" v-for="subLesson, index in lesson.subLessons">
                <div v-if="editing === index">
                    <CreateExerciseForm v-if="lesson.subLessonTypes[index]==='exercise'" 
                        :title="subLesson.title"
                        :questions="getQuestions(subLesson.questions)"
                        @update="(title: string, questions: any[]) => updateExercise(subLesson._id, title, questions)" 
                        @cancel="editing = -1"/>
                    <CreateVideoForm v-else-if="lesson.subLessonTypes[index]==='video'" 
                        :title="subLesson.title"
                        :videoUrl="subLesson.videoUrl"
                        @update="(title: string, videoUrl: string) => updateVideo(subLesson._id, title, videoUrl)" 
                        @cancel="editing = -1"/>
                </div>
                <div v-else>
                    <ExerciseComponent v-if="lesson.subLessonTypes[index]==='exercise'" 
                        :title="subLesson.title" 
                        :questions="subLesson.questions" 
                        :functional="false"/>
                    <VideoComponent v-else-if="lesson.subLessonTypes[index]==='video'" 
                        :title="subLesson.title" 
                        :videoUrl="subLesson.videoUrl"/>
                </div>
                <div class="editRemoveButtons">
                    <button v-if="editing !== index" @click="editing = index">Edit SubLesson</button>
                    <button @click="removeSubLesson(index)">Remove SubLesson</button>
                </div>
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
</style>