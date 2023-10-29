<script setup lang="ts">

import QuestionComponent from "@/components/SubLesson/QuestionComponent.vue";
import { ref } from "vue";

const props = defineProps(["title", "questions", "functional"]);

const functional = ref<boolean>(props.functional ?? true);
</script>

<template>
    <h2 class="exerciseTitle">{{ props.title }}</h2>
    <article v-for="question, index in props.questions">
        <QuestionComponent v-if="functional" :question="question.question" :answerType="question.answerType" :answer="question.answer" :index="index"/>
        <ul v-else>
            <li>type: {{ question.answerType }}</li>
            <li>question: {{ question.question }}</li>
            <li>answer: {{ question.answer }}</li>
        </ul>
    </article>
</template>

<style scoped>
.exerciseTitle {
    margin: 0;
    margin-top: 0.5em;
}
</style>