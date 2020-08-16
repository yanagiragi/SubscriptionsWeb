<template>
    <nav>
        <div class="nav-wrapper blue-grey lighten-1">
        <a href="#" class="brand-logo" style="display: block;" @click="$emit('reload-data')">
            <div id="SiteName">Subscriptions</div>
        </a>
        <!--
        <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a href="#" @click="SaveData">Save</a></li>
        </ul>
        -->
        </div>
    </nav>
</template>

<script>

export default {
  name: 'Navbar',
  props: [
    'mobileMode'
  ],
  methods: {
    Reload: function () {
      alert('123')
    },
    SaveData: function () {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#SiteName {
    padding-left: 10px;
}
.mobileSiteName {
    font-size: 12px;
}
</style>
