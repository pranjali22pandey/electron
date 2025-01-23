<template>
  <el-header class="navbar">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      background-color="#fff"
      text-color="#000"
      active-text-color="#0a8276"
    >
      <div v-if="!isSearchExpanded" class="navbar-logo" >
        <img
          src="../assets/images/ico.png" 
          class="company-logo"
        />
        <span class="application-name">Application name</span>
        <div class="separator"></div>
      </div>
      <el-menu-item index="1">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
      </el-menu-item>
      <el-menu-item index="2">
        <RouterLink to="/ag-grid" class="nav-link">AG-Grid</RouterLink>
      </el-menu-item>
    </el-menu>
    <div v-if="!isSearchExpanded" class="search-icon" @click="toggleSearch">
      <el-icon><Search /></el-icon> 
    </div>
    <div v-if="isSearchExpanded" class="search-bar-container">
      <el-input v-model="searchQuery" placeholder="Search..." class="search-bar">
        <template #append>
          <el-button icon="el-icon-search" @click="handleSearch"></el-button>
          <el-button
            type="primary"
            link
            size="medium"
            :style="{ backgroundColor: '#fff', borderColor: '#fff', color: '#0a8276', fontWeight: 'bold', fontSize: '16px', padding: '5px 15px', height: '40px' }"
            @click="closeSearch"
          >
            Close
        </el-button>
          
        </template>
      </el-input>
    </div>
  </el-header>
  <router-view :user-name="userName" />
</template>

<script setup>
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

const searchQuery = ref('');
const isSearchExpanded = ref(false);

const handleSearch = () => {
  console.log('Search query:', searchQuery.value);
};

const toggleSearch = () => {
  isSearchExpanded.value = !isSearchExpanded.value;
};

const closeSearch = () => {
  isSearchExpanded.value = false;
  searchQuery.value = '';
};
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0 20px;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.company-logo {
  height: 58px;
  width: 100px; 
  margin-right: 10px; 
}

.application-name {
  color: #000;
  font-size: 1rem; 
  font-weight: bold;
  margin-right: 5px;
  margin-left:0.1px; 
}

.separator {
  width: 1px; 
  height: 30px; 
  background-color: rgb(196, 196, 196);
  margin-left: 10px; 
}

.el-menu-demo {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: inherit;
  display: block;
  font-size: 1rem; 
  padding: 15px;
}

.el-menu-item {
  padding: 0 10px; 
}
.nav-link:hover {
  color: #0a8276; 
}

.search-icon {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-bar-container {
  display: flex;
  align-items: center;
  justify-content: center; 
  width: calc(100% - 40px);
  position: absolute;
  top: 15px;
  left: 0px;
  right: 0px;
  padding: 0 20px;
  background-color: #fff;
}

.search-bar {
  flex-grow: 1;
  margin-left: 0;
}

.el-input-group__append .el-button {
  border: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>