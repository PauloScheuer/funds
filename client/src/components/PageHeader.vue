<template>
  <div>
    <h2 class="title">{{ title }}</h2>
    <p class="text" v-for="item in text">{{ item }}</p>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    title: { type: String, required: true },
    text: { type: Array<String>, required: true },
  }
}
</script>