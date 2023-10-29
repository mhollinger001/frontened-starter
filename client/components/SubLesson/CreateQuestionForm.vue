<script setup lang="ts">
    import { defineEmits, defineProps, ref } from 'vue';

    const props = defineProps(["answerType", "question", "answer"]);
    const emit = defineEmits(["update", "remove"]);

    const answerType = ref<string>(props.answerType ?? "text");
    const question = ref<string>(props.question ?? "");
    const answer = ref<string>(props.answer ?? "");

    function updateQuestion() {
        emit('update', answerType, question, answer);
    }
</script>

<template>
    <form>
        <select v-model="answerType" @change="updateQuestion">
            <option value="text" selected>Text</option>
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
        </select>
        
        <input v-model="question" placeholder="Question" @input="updateQuestion">
        
        <input 
            v-if="answerType === 'text'"
            type="text" 
            v-model="answer" 
            @input="updateQuestion" 
            placeholder="Answer">
        <input 
            v-else-if="answerType === 'number'"
            type="number" 
            v-model="answer" 
            @input="updateQuestion" 
            placeholder="Answer">
        <input 
            v-else-if="answerType === 'checkbox'"
            type="checkbox" 
            v-model="answer" 
            @input="updateQuestion">
        <button type="button" @click="emit('remove')">Remove</button>
    </form>
</template>