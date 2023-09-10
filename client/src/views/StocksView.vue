<template>
  <div class="content-container">
    <PageHeader title="Stocks"
      :text="['In this page, you can take a look at Brazilian stocks and the funds that contain them on their portfolio.', 'Feel free to filter and order the results acording to you criteria.']" />
    <h3 class="subtitle">List of stocks:</h3>
    <SearchBar search-key="ticker" :order-by="tempSearchParams.orderBy" @change-filter="handleChangeFilter"
      :value="tempSearchParams.filterBy" @change-order="handleChangeOrder" @search="fetchInitialData" />
    <ListItems sublabel="funds" :items="items" @request-more-items="loadMoreStocks()" />
  </div>
</template>
<script lang="ts">
import ListItems from '@/components/ListItems.vue';
import PageHeader from '@/components/PageHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import api from '@/services/api';
import VueFeather from 'vue-feather';

type Stock = {
  stock: string,
  funds: string[]
}

export default {
  data() {
    return {
      stocks: [] as Stock[],
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
      this.curPage = 1;
      this.searchParams = { ...this.tempSearchParams };
      const res = await api.get('/relationships/stocks', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });
      if (res.status === 200) {
        this.stocks = res.data;
      }
    },
    async loadMoreStocks() {
      this.curPage++;
      const res = await api.get('/relationships/stocks', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });

      if (res.status === 200) {
        const returnedStocks = res.data;
        this.stocks = [...this.stocks, ...returnedStocks];
      }
    },
    handleChangeFilter(event: Event) {
      this.tempSearchParams.filterBy = (event.target as HTMLInputElement).value
    },
    handleChangeOrder() {
      this.tempSearchParams.orderBy *= -1;
    }
  },
  computed: {
    items() {
      return this.stocks.map(item => {
        return {
          key: item.stock,
          list: item.funds
        }
      })
    }
  },
  components: { VueFeather, PageHeader, SearchBar, ListItems }
}
</script>
<style scoped></style>