<script setup lang="ts">
    import { defineEmits, defineProps, ref, watch } from 'vue';
    import CreateQuestionForm from './CreateQuestionForm.vue';

    const props = defineProps(["title", "questions"]);
    const emit = defineEmits(["cancel", "update", "remove"]);

    interface question {
        question: string;
        answerType: string;
        answer: string;
    }

    const getDefaultQuestion = () => ({ question: "", answerType: "text", answer: "" })

    const title = ref<string>(props.title);
    const questions = ref<question[]>(props.questions ? props.questions : []);
    questions.value.push(getDefaultQuestion());

    function removeQuestion(index: number) {
        if (questions.value.length === 1) {
            emit("cancel");
        } else {
            questions.value.splice(index, 1);
        }
    }

    watch(questions, async (newQuestions, oldQuestinos) => {
        const lastQuestion = newQuestions[newQuestions.length - 1]
        if (lastQuestion.question !== "" && lastQuestion.answer !== "") {
            questions.value.push(getDefaultQuestion());
        }
        }, {deep: true}
    );
</script>

<template>
    <form @submit.prevent="emit('update', title, questions.slice(0, questions.length-1))">
        <input v-model="title" placeholder="Exercise Title">
        <CreateQuestionForm v-for="q, index in questions"
            :question="q.question"
            :answerType="q.answerType"
            :answer="q.answer"
            @update="(answerType: string, question: string, answer: string) => {questions[index] = {question, answerType, answer};}" 
            @remove="removeQuestion(index)"/>
        
        <button type="button" @click="emit('cancel')">Cancel</button>
        <button>Done</button>
        <button type="button" @click="emit('remove')">Remove</button>
    </form>
</template>