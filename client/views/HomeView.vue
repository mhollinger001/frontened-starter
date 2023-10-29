<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import LessonListComponent from "@/components/Lesson/LessonListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section v-if="isLoggedIn">
      <RouterLink :to="{ name: 'Create Lesson' }">
        <button class="button_plus"></button>
      </RouterLink>
    </section>
    <!-- <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->
    <LessonListComponent />
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

/* button {
  text-align: center;
  font-size:xx-large;
  position: fixed;
  bottom:5dvh;
  right: 5dvh;
} */

.button_plus {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgb(32, 192, 255);
  cursor: pointer;
  border: none;
  border-radius: 50%;

  /* Mittig */
  bottom:5dvh;
  right: 5dvh;
}

.button_plus:after {
  content: '';
  position: absolute;
  transform: translate(-50%, -50%);
  height: 7px;
  width: 50%;
  background: #fff;
  top: 50%;
  left: 50%;
}

.button_plus:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  height: 50%;
  width: 7px;
}

.button_plus:hover:before,
.button_plus:hover:after {
  background: rgb(32, 192, 255);
  transition: 0.2s;
}

.button_plus:hover {
  background: #f5f5f5;
  transition: 0.2s;
}
</style>
