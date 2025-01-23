<template>
  <%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
  <div class="dds-template-layout">
    <SideBar />
    <div class="dds-layout-content-layout">
      <div class="dds-layout-header-content">
        <ifx-search-field
          size="m"
          disabled="false"
          show-delete-icon="true"
        ></ifx-search-field>
          <%_ if(promptResults.authRequired === "Authentication using MIAMI (OAuth)") { _%>
            <div class="dds-layout-header-icons-container">
          <ProfileIcon :userNameShort="userNameShort" :userName="userName" />
        </div>
          <%_ } _%>
      </div>
      <router-view :userName="userName"/>
    </div>
  </div>
  <%_ } _%> 
  <%_ if(promptResults.isSideBarRequired == "Horizontal Menu" ) { _%>
  <div class="dds-layout-with-header-layout">
    <NavBar />
    <div class="dds-layout-with-header-layout-content">
    </div>
  </div>
  <%_ } _%>
 
</template>

<script>
<%_ if(promptResults.isSideBarRequired=="Horizontal Menu") { _%>
import NavBar from "./NavBar.vue";
<%_ } _%>
<%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
import SideBar from "./SideBar.vue";
  <%_ if(promptResults.authRequired === "Authentication using MIAMI (OAuth)") { _%>
import ProfileIcon from "./ProfileIcon.vue";
import { onMounted, ref } from 'vue';
import { ShowToaster } from "./Toaster";
import MIAMI from '@miami/miami'
  <%_ } _%>
<%_ } _%>

export default {
  name: 'TemplateLayout',
  <%_ if(promptResults.authRequired === "Authentication using MIAMI (OAuth)" && promptResults.isSideBarRequired=="Vertical Menu") { _%>
  setup() {
    const userName = ref("");
    const userNameShort = ref("");
    onMounted(() => {
          MIAMI.getTokenPayload()
          .then((payload) => {
              const {firstName, lastName} = payload || {};
              userName.value = `${firstName} ${lastName}`;
              userNameShort.value = firstName[0] + lastName[0];
          })
          .catch((error) => {
            ShowToaster(error.message)
          })
        })
    return {
      userName,
      userNameShort
    }
  },
  <%_ } _%>
  components: {
    <%_ if(promptResults.isSideBarRequired=="Horizontal Menu") { _%>
    NavBar,
    <%_ } _%>
    <%_ if(promptResults.isSideBarRequired=="Vertical Menu" ) { _%>
    SideBar,
      <%_ if(promptResults.authRequired === "Authentication using MIAMI (OAuth)") { _%>
    ProfileIcon
      <%_ } _%>
    <%_ } _%>
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
<%_ if(promptResults.isSideBarRequired == "Vertical Menu") { _%>
  .dds-template-layout {
    display: flex;
    .dds-layout-content-layout {
      width: 100%;
      margin-left: 265px;
      .dds-layout-header-content {
        display: flex;
        height: 30px;
        justify-content: space-between;
        margin: 10px 10px 10px 10px;
      }

      .dds-layout-header-icons-container {
        display: flex;

        .dds-header-profile-icon {
          margin: 0px 7px;
        }
      }

      .dds-header-icons {
        margin: 2px 5px;
        padding: 3px;
        cursor: pointer;
      }

      .dds-layout-search {
        width: 240px;
        height: 40px;
      }
    }
  }
<%_ } _%>
<%_ if(promptResults.isSideBarRequired == "Horizontal Menu") { _%>

.dds-layout-with-header-layout {
  display: flex;
  flex-direction: column;

  .dds-layout-with-header-layout-content {
    width: 100%;
  }
}
<%_ } _%>
</style>
