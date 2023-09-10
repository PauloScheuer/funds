<template>
  <div class="item-search">
    <input type="text" :placeholder="`Search for a ${searchKey}`" class="item-search-input" :value="value"
      @input="$event => $emit('changeFilter', $event)" />
    <div class="item-search-order">
      <span class="item-search-order-title">Order:</span>
      <VueFeather :type="orderBy > 0 ? 'chevron-up' : 'chevron-down'" class="item-search-order-icon"
        @click="$emit('changeOrder')" />
    </div>
    <VueFeather type="search" class="item-search-button" @click="$emit('search')" />
  </div>
</template>
<script lang="ts">
import VueFeather from 'vue-feather';

export default {
  props: {
    orderBy: { type: Number, required: true },
    searchKey: { type: String, required: true },
    value: { type: String, required: true }
  },
  emits: {
    changeFilter: (event: Event) => true,
    changeOrder: () => true,
    search: () => true,
  },
  components: { VueFeather }
}
</script>
<style scoped>
.item-search {
  background-color: white;
  width: 500px;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-search-input {
  background-color: #f0f0f0;
  border: none;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
  width: 200px
}

.item-search-input:focus {
  outline: none;
}

.item-search-order {
  display: flex;
  align-items: center;
}

.item-search-order-title {
  font-weight: bold;
  font-size: 14px;
}

.item-search-order-icon,
.item-search-button {
  cursor: pointer;
  transition: color 0.5s;
}

.item-search-order-icon:hover,
.item-search-button:hover {
  color: #2ECC71;
}
</style>