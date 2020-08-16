<template>
  <div class="home">
    <Navbar mobileMode="false"/>
    <Modal
      currentPreviewImg="https://i.imgur.com/fxu7K0x.jpg"
      currentPreviewTitle="Title"
      currentPreviewHref="https://i.imgur.com/fxu7K0x.jpg"
    />
    <a
      class="waves-effect waves-light btn btn-small modal-trigger"
      href="#modal1">
      preview Modal
    </a>
    <Collapsible v-on:show-modal="PreviewImage" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Navbar from '@/components/Navbar.vue'
import Modal from '@/components/Modal.vue'
import Collapsible from '@/components/Collapsible.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Navbar,
    Modal,
    Collapsible
  },
  methods: {
    PreviewImage: function (value) {
      alert(event)
      /*
      const [containerIndex, entryIndex] = value.split('|')
      const targetData = this.data.container[containerIndex].list.filter(e => e.id === entryIndex)[0]
      this.currentPreviewImg = targetData.img;
      this.currentPreviewTitle = targetData.title
      this.currentPreviewHref = targetData.href
      */
    }
  }
}
</script>
