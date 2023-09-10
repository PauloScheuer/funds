<template>
  <div class="item" v-for="(item, index) in localItems">
    <div class="item-header">
      <p class="item-title">
        <span>
          {{ `${item.name} - (${item.key})` }}
        </span>
        <span v-if="sublabel">
          - {{ item.list.length }} {{ sublabel }}
        </span>
        <span v-if="extraLabel"> - {{ extraLabel.label((item as any)[extraLabel.prop]) }}
        </span>
      </p>
      <div class="functions">
        <RouterLink :to="`${similarUrl}/?id=${encodeURIComponent(item.key)}&name=${encodeURIComponent(item.name)}`"
          class="page-link" v-if="similarUrl">
          <VueFeather size="24" type="zap" class="item-icon" />
        </RouterLink>
        <VueFeather size="24" :type="item.isOpen ? 'chevron-up' : 'chevron-down'" class="item-icon"
          v-if="item.list.length" @click="handleExpand(index)" />
      </div>
    </div>
    <div class="item-content" :class="item.isOpen && 'item-content-open'">
      <div class="item-content-inner">
        <div v-for="listItem in item.list" class="item-subitem">
          <div class="item-subitem-icon-container">
            <VueFeather size="8" type="disc" class="item-subitem-icon" />
          </div>
          <p class="item-subitem-text">{{ listItem }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="item-content-more" @click="$emit('requestMoreItems')">
    <VueFeather size="24" type="plus" />
  </div>
</template>
<script lang="ts">
import VueFeather from 'vue-feather';
import ExtraLabel from '@/common/ExtraLabel';

type Item = {
  key: string,
  name: string,
  list: string[]
}

type LocalItem = {
  key: string,
  name: string,
  list: string[],
  isOpen: boolean
}

export default {
  props: {
    items: { type: Array<Item>, required: true },
    sublabel: { type: String, required: true },
    extraLabel: { type: ExtraLabel, validator: () => true },
    similarUrl: { type: String },
  },
  emits: {
    requestMoreItems: () => true
  },
  methods: {
    handleExpand(nIndex: number) {
      this.localItems[nIndex].isOpen = !this.localItems[nIndex].isOpen
    }
  },
  data() {
    return {
      localItems: [] as LocalItem[]
    }
  },
  watch: {
    items(value) {
      this.localItems = value.map((item: Item, index: number) => {
        return {
          ...item,
          isOpen: false
        }
      });
    }
  },
  components: { VueFeather }
}
</script>
<style scoped>
.item {
  background-color: white;
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 8px;
  width: auto;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  font-weight: 500;
}

.item-icon {
  cursor: pointer;
  transition: color 0.5s;
}

.item-icon:hover {
  color: #2ECC71;
}

.item-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s;
}

.item-content-open {
  grid-template-rows: 1fr;
}

.item-content-inner {
  overflow: hidden;
}

.item-subitem {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.item-subitem-icon-container {
  display: flex;
  align-items: center;
}

.item-subitem-icon {
  color: #2ECC71;
}

.item-subitem-text {
  font-size: 14px;
}

.item-content-more {
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.5s;
  width: auto;
  padding: 0px 8px;
  text-align: center;
}

.item-content-more:hover {
  color: #2ECC71;
}

.page-link {
  text-decoration: none;
  color: black;
  margin-right: 4px;
}

.functions {
  display: flex;
}
</style>