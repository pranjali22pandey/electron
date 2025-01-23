<template>
  <%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
    <el-container class="template-layout">
    <SideBar />
    <el-container direction="vertical" class="content-layout">
      <el-header class="header-content">
        <el-input
          v-model="searchQuery"
          placeholder="Search"
          clearable
          class="search-field"
        >
          <template #append>
            <el-button icon="el-icon-search"></el-button>
          </template>
        </el-input>
      </el-header>
      <el-main>
        <router-view :user-name="userName"/>
      </el-main>
    </el-container>
  </el-container>
  <%_ } _%> 
  <%_ if(promptResults.isSideBarRequired == "Horizontal Menu" ) { _%>
    <el-container direction="vertical" class="full-height-container">
  <el-header>
      <NavBar />
    </el-header>
    <el-main>
      <div class="layout-content">
        <!-- Your content goes here -->
      </div>
    </el-main>
 </el-container>
  <%_ } _%>
 
</template>

<script>
<%_ if(promptResults.isSideBarRequired=="Horizontal Menu") { _%>
import NavBar from "./NavBar.vue";
<%_ } _%>
<%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
import SideBar from "./SideBar.vue";
import { ref } from "vue";
<%_ } _%>

export default {
  name: 'TemplateLayout',
  components: {
    <%_ if(promptResults.isSideBarRequired=="Horizontal Menu") { _%>
    NavBar,
     } 
  
     <%_ };_%>
    <%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
    SideBar,
    },
    setup() {
      const searchQuery = ref("");
      return {
        searchQuery,
      };
    }
    <%_ } _%>
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
<%_ if(promptResults.isSideBarRequired == "Vertical Menu") { _%>
  .template-layout {
  display: flex;
}

.content-layout {
  width: 100%;
  margin-left: 240px;

  .header-content {
    display: flex;
    height: 40px;
    justify-content: space-between;
    padding: 10px;
  }

  .search-field {
    width: 275px;
    height: 42px;
    border-radius: px;
  }
  .search-field .el-input__inner {
  border-color: #0a8276;
}

.search-field .el-input__inner:focus,
.search-field .el-input__inner:hover {
  border-color: #0a8276;
  box-shadow: 0 0 2px rgba(10, 130, 118, 0.5); /* Add some shadow for focus effect */
}
}
<%_ } _%>
<%_ if(promptResults.isSideBarRequired == "Horizontal Menu") { _%>

  .full-height-container {
  height: 100vh;  
  display: flex;
  flex-direction: column;  
}

.el-header, .el-main {
  flex: 0 0 auto;  
}

.el-main {
  flex: 1 1 auto;  
}

.layout-content {
  width: 100%;
}
<%_ } _%>
</style>
