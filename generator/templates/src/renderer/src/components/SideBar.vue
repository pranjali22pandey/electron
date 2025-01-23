
<template>
  <el-aside width="250px" class="sidebar">
 <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      router
      background-color="#fff"
      text-color="#000"
      active-text-color="#0a8276"
    >
    <div class="sidebar-header">
      <img src="../assets/images/ico.png" alt="Company Logo" class="sidebar-logo" />
      <span class="application-name">Application Name</span>
    </div>
      <el-menu-item >
        <RouterLink to="/" class="sidebar-link">
          <i class="el-icon-menu"></i>
          <span class="menu-text">Home</span>
        </RouterLink>
      </el-menu-item>
      <el-menu-item >
        <RouterLink to="/ag-grid" class="sidebar-link">
          <i class="el-icon-menu"></i>
          <span class="menu-text">AG-Grid</span>
        </RouterLink>
      </el-menu-item>
      
      <!-- Ensure the separator is placed correctly -->
      
      
      <div class="sidebar-footer">
        <div class="sidebar-footer-separator"></div>
        <a href="https://yourwebsite.com/terms" target="_blank" class="footer-link">Terms of Use</a>
        <a href="https://yourwebsite.com/imprint" target="_blank" class="footer-link" style="margin-left: 10px;">Imprint</a><br><br>
        <a href="https://yourwebsite.com/privacy-policy" target="_blank" class="footer-link" style="margin-top: 10px;">Privacy Policy</a>
        <div class="copyright-text">© 1999 - 2024 Infineon <br>Technologies AG</div>
      </div>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "SideBar"
}
</script>

<style scoped lang="scss">
.sidebar {
  top: 0;
  height: 100vh;
  position: fixed;
  background-color: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 25px;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.sidebar-logo {
  width: 115px;
  margin-bottom: 10px;
}

.application-name {
  font-size: 1rem;
  font-weight: bold;
  color: #000;
}

.el-menu-vertical-demo {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #fff;
}

.sidebar-link {
  text-decoration: none;
  color: #000;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 1rem;
}

.sidebar-link:hover {
  color: #0a8276;
  border-radius: 5px;
}
.sidebar-footer-separator {
  height: 0px;
  background-color: #0f0f0f; /* Ensure this color is visible */
  margin: 20px 1px; /* Adjust margin to provide spacing */
  border: 0.5px solid rgb(235, 233, 233); /* For debugging purposes */
}
.menu-text {
  margin-left: -60px;
}

.el-menu-item.is-active {
  box-shadow: none !important;
}

.sidebar-footer {
  margin-top: auto;
  text-align: left;
  padding-top: 20px;
  font-size: 13px;
}

.footer-link {
  color: #000;
  text-decoration: none;
  margin-right: 10px;
}

.footer-link:hover {
  text-decoration: underline;
}

.footer-link:not(:last-child) {
  margin-bottom: 10px;
}

.copyright-text {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #696868;
}
</style>