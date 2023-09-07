<template>
  <div class="content-container">
    <PageHeader :title="`Similar Funds to ${$route.params.id}`"
      :text="[`This page shows funds ranked by their similarity with ${$route.params.id}`]" />
    <h3 class="subtitle">List of similar funds:</h3>
    <ListItems :items="items" @request-more-items="loadMoreFunds" sublabel="stocks" :extra-label="extraLabel" />
  </div>
</template>
<script lang="ts">
import ListItems from '@/components/ListItems.vue';
import PageHeader from '@/components/PageHeader.vue';
import api from '@/services/api';
import ExtraLabel from '@/common/ExtraLabel';

type SimilarFund = {
  fund: string,
  stocks: string[],
  similarity: number
}

export default {
  data() {
    return {
      funds: [] as SimilarFund[],
      curPage: 1,
      extraLabel: new ExtraLabel('similarity', this.formatSimilarity as any)
    }
  }, mounted() {
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      this.curPage = 1;
      const res = await api.get('/relationships/similarFunds', {
        params: {
          fund: this.$route.params.id,
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
      const res = await api.get('/relationships/similarFunds', {
        params: {
          fund: this.$route.params.id,
          pageNumber: this.curPage,
          pageSize: 10
        }
      });

      if (res.status === 200) {
        const returnedFunds = res.data;
        this.funds = [...this.funds, ...returnedFunds];
      }
    },
    formatSimilarity(similarity: number) {
      const percent = (similarity * 100).toFixed(2);
      return `${percent}% of similarity`;
    }
  },
  computed: {
    items() {
      return this.funds.map(item => {
        return {
          key: item.fund,
          list: item.stocks,
          similarity: item.similarity,
        }
      })
    }
  },
  components: { PageHeader, ListItems }
}
</script>