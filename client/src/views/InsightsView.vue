<template>
  <div class="content-container">
    <PageHeader title="Insights" :text="[]" />
    <div class="mode-selector">
      <div class="mode-option" :class="mode === fund && 'mode-option-selected'" @click="mode === stock && (mode = fund)">
        Fund insights</div>
      <div class="mode-option" :class="mode === stock && 'mode-option-selected'" @click="mode === fund && (mode = stock)">
        Stock insights</div>
    </div>
    <h3 class="subtitle">List of insights:</h3>
    <SearchBar search-key="ticker" :order-by="tempSearchParams.orderBy" @change-filter="handleChangeFilter"
      @change-order="handleChangeOrder" @search="fetchInitialData" />
    <ListItems sublabel="" :items="items" @request-more-items="loadMoreInsights()" :extra-label="extraLabel" />
  </div>
</template>
<script lang="ts">
import ExtraLabel from '@/common/ExtraLabel';
import ListItems from '@/components/ListItems.vue';
import PageHeader from '@/components/PageHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import api from '@/services/api';
import VueFeather from 'vue-feather';

type Insight = {
  first: string[],
  second: string[],
  frequency: number
}

enum Mode {
  stock,
  fund
}

export default {
  data() {
    return {
      insights: [] as Insight[],
      curPage: 1,
      tempSearchParams: {
        filterBy: '',
        orderBy: -1
      },
      searchParams: {
        filterBy: '',
        orderBy: -1
      },
      extraLabel: new ExtraLabel('frequency', this.formatFrequency as any),
      mode: Mode.fund,
      ...Mode
    }
  },
  mounted() {
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      this.curPage = 1;
      this.searchParams = { ...this.tempSearchParams };
      const res = await api.get('/insights/stocks', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });
      if (res.status === 200) {
        this.insights = res.data;
      }
    },
    async loadMoreInsights() {
      this.curPage++;
      const res = await api.get('/insights/stocks', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });
    },
    handleChangeFilter(event: Event) {
      this.tempSearchParams.filterBy = (event.target as HTMLInputElement).value
    },
    handleChangeOrder() {
      this.tempSearchParams.orderBy *= -1;
    },
    formatFrequency(frequency: number) {
      const percent = (frequency * 100).toFixed(2);
      return `${percent}% of frequency`;
    }
  },
  computed: {
    items() {
      return this.insights.map(item => {
        return {
          key: `[${item.first.join(", ")}] -> [${item.second.join(", ")}]`,
          frequency: item.frequency,
          list: []
        }
      })
    }
  },
  components: { VueFeather, PageHeader, SearchBar, ListItems }
}
</script>
<style scoped>
.mode-selector {
  display: flex;
  gap: 10px;
}

.mode-option {
  background-color: white;
  padding: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.5s;
  font-size: 20px;
  border: 3px solid #2ECC71;
  color: #2ECC71;
}

.mode-option:hover {
  background-color: #74e3a3;
  color: white;
}

.mode-option-selected,
.mode-option-selected:hover {
  background-color: #2ECC71;
  color: white;
}
</style>