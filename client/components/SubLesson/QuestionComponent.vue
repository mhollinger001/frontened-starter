<script setup lang="ts">
import { ref } from 'vue';
import { useToastStore } from "../../stores/toast";

const props = defineProps(["question", "answerType", "answer", "index"]);
let answer = ref(props.answerType === 'checkbox' ? false : "");

function answerQuestion() {
    const correct = answer.value === props.answer;
    useToastStore().showToast({ message: correct ? 'Correct!' : 'Wrong :( Try again!', style: correct ? "success" : "error" });
}

</script>

<template>
    <form @submit.prevent="answerQuestion">
        <p>{{ props.question }}</p>
        <input :id="props.index" v-model="answer" :type="props.answerType" placeholder="Answer">
        <label v-if="props.answerType === 'checkbox' && answer === true" :for="props.index">True</label>
        <label v-if="props.answerType === 'checkbox' && answer === false" :for="props.index">False</label>
        <input type="submit" value="Submit"> 
    </form>
    <!-- <p>{{ props.question.answerType }}</p> -->
    <!-- <p>{{ props.question.answer }}</p> -->
</template>

<style scoped>
input[type="checkbox"] {
    display: none;
}

label {
    background-color: white;
    padding: 0.2em 0.5em;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
}
</style>