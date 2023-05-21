<template>
  <ww-open-data :type="type" :openid="openid" />
</template>
<script>
export default {
  name: "WWOpenData",
  props: ["type", "openid"],
  watch: {
    openid(item) {
      this.$nextTick(() => {
        window.WWOpenData.bind(this.$el);
      });
    },
  },
  mounted() {
    window.WWOpenData.bind(this.$el);
  },
};
</script>
