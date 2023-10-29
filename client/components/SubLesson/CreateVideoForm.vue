<script setup lang="ts">
    import { defineEmits, defineProps, ref } from 'vue';

    const props = defineProps(["title", "videoUrl"]);
    const emit = defineEmits(["cancel", "update"]);

    const title = ref<string>(props.title);
    const videoUrl = ref<string>(props.videoUrl);
</script>

<template>
    <form @submit.prevent="emit('update', title, videoUrl)">
        <input v-model="title" placeholder="Video Title">
        <input v-model="videoUrl" placeholder="Video Url">
        
        <button type="button" @click="emit('cancel')">Cancel</button>
        <button>Done</button>
    </form>
</template>