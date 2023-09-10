<template>
  <div class="content-container">
    <PageHeader title="Insights"
      :text="['Here, you can find valuable insights about funds and stocks', 'Each item shows a condition and an implication, along with the frequency that it is true']" />
    <div class="mode-selector">
      <div class="mode-option" :class="mode === fund && 'mode-option-selected'" @click="mode === stock && (mode = fund)">
        Fund insights</div>
      <div class="mode-option" :class="mode === stock && 'mode-option-selected'" @click="mode === fund && (mode = stock)">
        Stock insights</div>
    </div>
    <h3 class="subtitle">List of insights:</h3>
    <SearchBar :search-key="searchKey" :order-by="tempSearchParams.orderBy" :value="tempSearchParams.filterBy"
      @change-filter="handleChangeFilter" @change-order="handleChangeOrder" @search="fetchInitialData" />

    <div class="insight" v-for="insight in insights">
      <div class="data">
        <div class="items" :class="mode === stock ? 'stock-items' : 'fund-items'">
          <span v-for="item in insight.first" class="item" :class="mode === stock ? 'stock-item' : 'fund-item'">{{ item
          }}</span>
        </div>
        <div class="arrow">
          <VueFeather size="16" type="arrow-right" />
        </div>
        <div class="items" :class="mode === stock ? 'stock-items' : 'fund-items'">
          <span v-for="item in insight.second" class="item" :class="mode === stock ? 'stock-item' : 'fund-item'">{{ item
          }}</span>
        </div>
      </div>
      <div class="frequency">
        {{ formatFrequency(insight.frequency) }}
      </div>
    </div>
    <div class="more-insights" @click="loadMoreInsights">
      <VueFeather size="32" type="plus" />
    </div>
  </div>
</template>
<script lang="ts">
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
      const res = await api.get('/insights/' + this.searchPath, {
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
      const res = await api.get('/insights/' + this.searchPath, {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });

      if (res.status === 200) {
        const returnedInsights = res.data;
        this.insights = [...this.insights, ...returnedInsights];
      }
    },
    handleChangeFilter(event: Event) {
      this.tempSearchParams.filterBy = (event.target as HTMLInputElement).value
    },
    handleChangeOrder() {
      this.tempSearchParams.orderBy *= -1;
    },
    formatFrequency(frequency: number) {
      const percent = (frequency * 100).toFixed(2);
      return `${percent}%`;
    }
  },
  computed: {
    searchKey() {
      if (this.mode === Mode.stock) {
        return 'ticker';
      }

      return 'CNPJ';
    },
    searchPath() {
      if (this.mode === Mode.stock) {
        return 'stocks';
      }

      return 'funds';
    }
  },
  watch: {
    mode() {
      this.tempSearchParams = {
        filterBy: '',
        orderBy: -1
      }
      this.searchParams = {
        filterBy: '',
        orderBy: -1
      }
      this.insights = [];
      this.fetchInitialData();
    }
  },
  components: { VueFeather, PageHeader, SearchBar, ListItems }
}
</script>
<style scoped>
.mode-selector {
  margin-top: 32px;
  display: flex;
  gap: 10px;
}

.mode-option {
  background-color: white;
  padding: 12px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.5s;
  font-size: 18px;
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

.insight {
  background-color: white;
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 16px 8px;
  width: 500px;
  display: flex;
  align-items: center;
}

.data {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.items {
  display: grid;
  gap: 10px;
  max-width: 45%;
  width: fit-content;
}

.stock-items {
  grid-template-columns: repeat(auto-fit, 80px);
}

.fund-items {
  grid-template-columns: repeat(auto-fit, 180px);
}

.arrow {
  display: flex;
  justify-content: center;
  width: 10%;
}

.item {
  padding: 4px 10px;
  background-color: #f0f0f0;
  border-radius: 15px;
  text-align: center;
}

.stock-item {
  width: 60px;
}

.fund-item {
  width: 160px;
}

.frequency {
  background-color: #2ECC71;
  color: white;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 15px;
  margin-left: 20px;
}

.more-insights {
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.5s;
  width: 500px;
  padding: 0px 8px;
  text-align: center;
}

.more-insights:hover {
  color: #2ECC71;
}
</style>