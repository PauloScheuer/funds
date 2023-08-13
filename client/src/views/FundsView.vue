<template>
  <div class="content-container">
    <h2 class="title">Funds</h2>
    <p class="text">In this page, you can take a look at Brazilian stock funds and their portfolio.</p>
    <p class="text">Feel free to filter and order the results acording to you criteria.</p>
    <h3 class="subtitle">List of funds:</h3>
    <div class="fund-search">
      <input type="text" placeholder="Search for a CNPJ" class="fund-search-input" @input="handleChangeFilter" />
      <div class="fund-search-order">
        <span class="fund-search-order-title">Order:</span>
        <VueFeather :type="tempSearchParams.orderBy > 0 ? 'chevron-up' : 'chevron-down'" class="fund-search-order-icon"
          @click="tempSearchParams.orderBy *= -1" />
      </div>
      <VueFeather type="search" class="fund-search-button" @click="fetchInitialData()" />
    </div>
    <div class="fund" v-for="(fund, index) in funds">
      <div class="fund-header">
        <p class="fund-title">
          {{ fund.fund }} - {{ fund.stocks.length }} stocks
        </p>
        <VueFeather size="24" :type="fund.isOpen ? 'chevron-up' : 'chevron-down'" class="fund-expand"
          @click="handleExpand(index)" />
      </div>
      <div class="fund-content" :class="fund.isOpen && 'fund-content-open'">
        <div class="fund-content-inner">
          <p v-for="stock in fund.stocks" class="fund-item">{{ stock }}</p>
        </div>
      </div>
    </div>
    <div class="fund-content-more" @click="loadMoreFunds()">
      <VueFeather size="32" type="plus" />
    </div>
  </div>
</template>
<script lang="ts">
import api from '@/services/api';
import VueFeather from 'vue-feather'

type Fund = {
  fund: string,
  stocks: string[],
  isOpen: boolean
}

export default {
  data() {
    return {
      funds: [] as Fund[],
      curPage: 1,
      tempSearchParams: {
        filterBy: '',
        orderBy: 1
      },
      searchParams: {
        filterBy: '',
        orderBy: 1
      }
    }
  },
  mounted() {
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      this.searchParams = { ...this.tempSearchParams };
      const res = await api.get('/relationships/funds', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy
        }
      });
      if (res.status === 200) {
        this.funds = res.data.map((fund: Fund) => {
          return {
            ...fund,
            isOpen: false
          }
        });
      }
    },
    async loadMoreFunds() {
      this.curPage++;
      const res = await api.get('/relationships/funds', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
        }
      });

      if (res.status === 200) {
        const returnedFunds = res.data.map((fund: Fund) => {
          return {
            ...fund,
            isOpen: false
          }
        });
        this.funds = [...this.funds, ...returnedFunds];
      }
    },
    handleExpand(nIndex: number) {
      this.funds[nIndex].isOpen = !this.funds[nIndex].isOpen
    },
    handleChangeFilter(event: Event) {
      this.tempSearchParams.filterBy = (event.target as HTMLInputElement).value
    }
  },
  components: { VueFeather }
}
</script>
<style scoped>
.fund {
  background-color: white;
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 8px;
  width: 500px;
}

.fund-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fund-title {
  font-size: 20px;
  font-weight: 500;
}

.fund-expand {
  cursor: pointer;
  transition: color 0.5s;
}

.fund-expand:hover {
  color: #2ECC71;
}

.fund-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s;
}

.fund-content-open {
  grid-template-rows: 1fr;
}

.fund-content-inner {
  overflow: hidden;
}

.fund-item {
  font-size: 14px;
  margin-bottom: 4px;
}

.fund-content-more {
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.5s;
  width: 500px;
  padding: 0px 8px;
  text-align: center;
}

.fund-content-more:hover {
  color: #2ECC71;
}

.fund-search {
  background-color: white;
  width: 500px;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fund-search-input {
  background-color: #f0f0f0;
  border: none;
  padding: 8px;
  border-radius: 5px;
  font-size: 14px;
}

.fund-search-input:focus {
  outline: none;
}

.fund-search-order {
  display: flex;
  align-items: center;
}

.fund-search-order-title {
  font-weight: bold;
  font-size: 14px;
}

.fund-search-order-icon,
.fund-search-button {
  cursor: pointer;
  transition: color 0.5s;
}

.fund-search-order-icon:hover,
.fund-search-button:hover {
  color: #2ECC71;
}
</style>