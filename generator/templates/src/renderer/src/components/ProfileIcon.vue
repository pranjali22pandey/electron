<template>
  <div id="dds-template-profileImage" :title="userName">
    {{ userNameShort }}
  </div>
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
};
</script>

<style lang="scss">
#dds-template-profileImage {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  border-radius: 50%;
  background: #478f7c;
  font-size: 16px;
  color: hsl(0, 0%, 100%);
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0px 5px;
}
</style>
