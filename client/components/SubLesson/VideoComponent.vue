<script setup lang="ts">

const props = defineProps(["title", "videoUrl"]);
</script>

<template>
    <h2>{{ props.title }}</h2>
    <iframe id="video" width="100%" height="700vw" :src="props.videoUrl"></iframe>
</template>
