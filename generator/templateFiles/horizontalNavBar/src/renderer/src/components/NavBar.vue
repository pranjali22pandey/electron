<template>
  <ifx-navbar show-logo="true" application-name="Application name" fixed="true">
    <ifx-navbar-item slot="left-item" hide-label="false">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
    </ifx-navbar-item>
    <ifx-navbar-item slot="left-item" hide-label="false">
      <RouterLink to="/ag-grid" class="nav-link">AG-Grid</RouterLink>
    </ifx-navbar-item>
    <ifx-search-bar slot="search-bar-right" v-model="searchQuery" is-open="false" show-close-button="true"></ifx-search-bar>
     
    <%_ if(promptResults.authRequired == "Authentication using MIAMI (OAuth)" && promptResults.isSideBarRequired=="Horizontal Menu") { _%>
        <ifx-navbar-item slot="right-item" hide-label="false">
        <ProfileIcon :userNameShort="userNameShort" :userName="userName" />
      </ifx-navbar-item>
      <%_ } _%>
  
  </ifx-navbar>
  <router-view :userName="userName" />
</template>

<script setup>
<%_ if(promptResults.authRequired == "No Authentication") { _%>
import { ref } from "vue";
<%_ } _%>

<%_ if(promptResults.authRequired == "Authentication using MIAMI (OAuth)" && promptResults.isSideBarRequired=="Horizontal Menu") { _%>
import MIAMI from '@miami/miami';
import ProfileIcon from './ProfileIcon.vue';
import { ShowToaster } from "./Toaster";
import { onMounted, ref } from 'vue';

const userName = ref("");
const userNameShort = ref("");

onMounted(() => {
    MIAMI.getTokenPayload()
    .then((payload) => {
        const { firstName, lastName } = payload || {};
        userName.value = `${firstName} ${lastName}`;
        userNameShort.value = firstName[0] + lastName[0];
    })
    .catch((error) => {
        ShowToaster(error.message);
    });
});
<%_ } _%>

const searchQuery = ref(""); 

</script>


<style>
.dds-layout-nav-bar-icons {
  margin: 2px 5px;
  padding: 3px;
  cursor: pointer;
}
.nav-link {
  text-decoration: none;
  color: inherit; 
}

</style>
