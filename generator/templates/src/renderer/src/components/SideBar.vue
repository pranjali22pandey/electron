<template>
  <ifx-sidebar
    application-name="Application Name"
    show-header="true"
    show-footer="true"
    initial-collapse="true"
    terms-of-use="https://yourwebsite.com/terms"
    imprint="https://yourwebsite.com/imprint"
    privacy-policy="https://yourwebsite.com/privacy-policy"
    copyright-text="© 1999 - 2024 Infineon Technologies AG"
    class="dds-app-side-bar"
  >
    <ifx-sidebar-item
      :to="{ name: 'Home' }"
      is-action-item="false"
      icon="image-16"
    >
      <RouterLink to="/" class="sidebar-link">Home</RouterLink>
    </ifx-sidebar-item>
    <ifx-sidebar-item
      :to="{ name: 'AG-Grid' }"
      is-action-item="false"
      icon="image-16"
    >
      <RouterLink to="/ag-grid" class="sidebar-link">AG-Grid</RouterLink>
    </ifx-sidebar-item>
  </ifx-sidebar>
</template>

<script>
export default {
  name: "SideBar"
}
</script>

<style lang="scss">
.dds-app-side-bar {
  top: 0;
  height: 100vh;
  position: fixed;
}

.sidebar-link {
  text-decoration: none; 
  color: inherit;        
}
</style>
