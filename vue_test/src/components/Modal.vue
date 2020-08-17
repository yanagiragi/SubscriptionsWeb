<template>
    <div id="modal1" class="modal">
      <div class="modal-content">
          <h4 style="text-alignment: center">
              <a v-bind:href="currentPreviewHref" target="_blank">
                  {{ currentPreviewTitle }}
              </a>
          </h4>
          <div style="padding-top: 50px">
              <img v-bind:src="currentPreviewImg" style="width: 100%">
          </div>
      </div>
      <div class="modal-footer">
          <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
      </div>
    </div>
</template>

<script>

import M from 'materialize-css'

export default {
  name: 'Modal',
  props: [
    'currentPreviewTitle', 'currentPreviewImg', 'currentPreviewHref'
  ],
  components: {
    // Collapsible
  },
  mounted () {
    const InitModal = () => {
      const elems = document.querySelectorAll('.modal')
      const options = {}
      M.Modal.init(elems, options)
    }

    InitModal()
  }
}
</script>
