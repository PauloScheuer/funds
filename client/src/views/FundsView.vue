<template>
  <div class="content-container">
    <PageHeader title="Funds"
      :text="['In this page, you can take a look at Brazilian stock funds and their portfolio.', 'Feel free to filter and order the results acording to you criteria.', 'By clicking on the zap icon on each fund you can see others similar to it!']" />
    <h3 class="subtitle">List of funds:</h3>
    <SearchBar search-key="CNPJ or a name" :order-by="tempSearchParams.orderBy" @change-filter="handleChangeFilter"
      :value="tempSearchParams.filterBy" @change-order="handleChangeOrder" @search="fetchInitialData" />
    <ListItems sublabel="stock(s)" :items="items" @request-more-items="loadMoreFunds()" :similar-url="'similarFunds'" />
  </div>
</template>
<script lang="ts">
import ListItems from '@/components/ListItems.vue';
import PageHeader from '@/components/PageHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import api from '@/services/api';
import VueFeather from 'vue-feather';

type Fund = {
  fund: string,
  fundPretty: string,
  stocks: string[],
  stocksPretty: string[]
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
      this.curPage = 1;
      this.searchParams = { ...this.tempSearchParams };
      const res = await api.get('/relationships/funds', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });
      if (res.status === 200) {
        this.funds = res.data;
      }
    },
    async loadMoreFunds() {
      this.curPage++;
      const res = await api.get('/relationships/funds', {
        params: {
          filterBy: this.searchParams.filterBy,
          orderBy: this.searchParams.orderBy,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });

      if (res.status === 200) {
        const returnedFunds = res.data;
        this.funds = [...this.funds, ...returnedFunds];
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
      return this.funds.map(item => {
        return {
          key: item.fund,
          name: item.fundPretty,
          list: item.stocks.map((stock, index) => {
            return `${item.stocksPretty[index]} (${stock})`
          })
        }
      })
    }
  },
  components: { VueFeather, PageHeader, SearchBar, ListItems }
}
</script>
<style scoped></style>