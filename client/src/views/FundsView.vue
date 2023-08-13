<template>
  <div class="content-container">
    <PageHeader title="Funds"
      :text="['In this page, you can take a look at Brazilian stock funds and their portfolio.', 'Feel free to filter and order the results acording to you criteria.', 'By clicking on the zap icon on each fund you can see others similar to it!']" />
    <h3 class="subtitle">List of funds:</h3>
    <SearchBar :order-by="tempSearchParams.orderBy" @change-filter="handleChangeFilter" @change-order="handleChangeOrder"
      @search="fetchInitialData" />
    <ListItems sublabel="stocks" :items="items" @request-more-items="loadMoreFunds()" :b-has-similar="true" />
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
  stocks: string[]
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
          list: item.stocks
        }
      })
    }
  },
  components: { VueFeather, PageHeader, SearchBar, ListItems }
}
</script>
<style scoped></style>