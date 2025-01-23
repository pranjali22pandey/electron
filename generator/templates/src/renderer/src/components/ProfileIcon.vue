
<template>
  <el-avatar
    :title="userName"
    class="profile-avatar"
    :style="avatarStyle"
  >
    {{ userNameShort }}
  </el-avatar>
</template>

<script>
/**
 * @vue-prop {String} userName
 * @vue-prop {String} userNameShort
 */
export default {
  name: "ProfileIcon",
  props: {
    userName: String,
    userNameShort: String,
  },
  computed: {
    avatarStyle() {
      return {
        background: '#478f7c',
        fontSize: '16px',
        color: 'hsl(0, 0%, 100%)'
      };
    }
  }
};
</script>

<style scoped>
.profile-avatar {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
}
</style>