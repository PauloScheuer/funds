<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import VueFeather from 'vue-feather'
</script>

<template>
  <div class="container">

    <div class="side-menu box">
      <h1 class="app-title">InvestScan</h1>
      <div class="link-options">
        <RouterLink class="link" to="/">Home</RouterLink>
        <RouterLink class="link" to="/funds">Funds</RouterLink>
        <RouterLink class="link" to="/stocks">Stocks</RouterLink>
      </div>
      <div class="about">
        <a href="https://www.github.com/PauloScheuer/" class="about-item">
          <VueFeather size="24" type="github" />
        </a>
        <a href="https://www.linkedin.com/in/paulo-roberto-scheuer-gomes-848bb11a4/" class="about-item">
          <VueFeather size="24" type="linkedin" />
        </a>
      </div>
    </div>

    <div class="content box">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

body {
  font-family: 'Roboto', cursive !important;
}

.container {
  display: flex;
  background-color: #f0f0f0;
  height: 100vh;
}

.side-menu {
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
}

.app-title {
  font-size: 48px;
  text-align: center;
  margin-top: 48px;
}

.link-options {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.link {
  text-decoration: none;
  color: white;
  text-align: center;
  font-size: 20px;
  padding: 10px 0px;
  border: 2px solid transparent;
  width: 70%;
  margin-bottom: 8px;
  transition: border-color 0.5s;
  border-radius: 30px;
}

.link:hover {
  border-color: #2ECC71;
}

.about {
  margin-top: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.about-item {
  cursor: pointer;
  transition: 0.5s;
  color: white;
}

.about-item:hover {
  color: #2ECC71;
}

.content {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 330px);
  height: calc(100vh - 20px);
  border-radius: 5px;
  margin-top: 10px;
  margin-left: 10px;
  overflow-y: scroll;
}

.content-container {
  margin: 40px 0px 0px 40px;
}

.title {
  color: #2ECC71;
  font-weight: bold;
  font-size: 48px;
  margin-bottom: 40px;
}

.subtitle {
  color: #2ECC71;
  font-weight: bold;
  font-size: 32px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.text {
  font-size: 20px;
  margin-bottom: 8px;
  background-color: white;
  padding: 8px;
  border-radius: 5px;
  width: fit-content;
  box-shadow: 2px 2px 0px 0px #2ECC71;
}

.item {
  background-color: white;
  margin-bottom: 8px;
  border-radius: 5px;
  padding: 8px;
  width: 500px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title {
  font-size: 20px;
  font-weight: 500;
}

.item-expand {
  cursor: pointer;
  transition: color 0.5s;
}

.item-expand:hover {
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
  font-size: 14px;
  margin-bottom: 4px;
}

.item-content-more {
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: color 0.5s;
  width: 500px;
  padding: 0px 8px;
  text-align: center;
}

.item-content-more:hover {
  color: #2ECC71;
}

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
