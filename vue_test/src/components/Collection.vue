<template>
  <div>
    <!-- Modal -->
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

    <!-- Collapsible -->
    <ul v-if="mode === 'showUnNoticedOnly'" class="collapsible collection" data-collapsible="accordion">
      <li v-for="container in data.container" :key="container.id">
        <!--<Collapsible
          :container="container"
          :type="data.types[container.typeId]"
          v-on:read-all-entries="ReadAllEntries"
          v-on:read-entry="ReadEntry"
          v-on:preview-image="PreviewImage"
        />-->

        <div v-if="container.unNoticedCount > 0" class="collapsible-header" @click="$emit('expand-site')">
            <i class="material-icons">filter_drama</i>
            {{ data.types[container.typeId] }} [ {{ container.nickname }} ]
            <span class="badge new">
                {{ container.unNoticedCount }}
            </span>
            <span
                class="btn btn-small-ex"
                @click="ReadAllEntries($event, container.typeId)"
            >
                read all
            </span>
        </div>

        <div v-if="container.unNoticedCount > 0" class="collapsible-body">
            <ul class="collection">
                <li v-for="entry in container.list" :key="entry.id">
                    <div v-if="entry.isNoticed == false">

                        <div class="yrBtn">
                            <a href="#"
                                class="waves-effect waves-light btn btn-small modal-trigger"
                                @click="ReadEntry($event, container.id, entry.id)">
                                read
                            </a>
                        </div>

                        <div class="yrBtn">
                            <a v-if="entry.img != 'NULL'"
                                class="waves-effect waves-light btn btn-small modal-trigger"
                                href="#modal1"
                                @click="PreviewImage(container.id, entry.id)">
                                preview
                            </a>
                        </div>

                        <a
                            v-bind:href="entry.href"
                            target="_blank"
                            class="collection-item"
                            style="margin-left: 30px; display: inline-block; width: calc(100vw - 232px); text-align: left;">
                            {{ entry.title }}
                        </a>

                    </div>
                </li>
            </ul>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>

import M from 'materialize-css'
// import Collapsible from './Collapsible.vue'

export default {
  name: 'Collection',
  data () {
    return {
      currentPreviewTitle: 'PlaceHolder',
      currentPreviewImg: 'placeholder.png',
      currentPreviewHref: 'about:blank'
    }
  },
  components: {
    // Collapsible
  },
  props: [
    'data', 'mode'
  ],
  mounted () {
    const InitCollapsible = () => {
      const elems = document.querySelectorAll('.collapsible')
      const options = {}
      console.log(elems)
      M.Collapsible.init(elems, options)
    }

    const InitModal = () => {
      const elems = document.querySelectorAll('.modal')
      const options = {}
      M.Modal.init(elems, options)
    }

    InitCollapsible()
    InitModal()
  },
  methods: {
    ExpandSite: function () {
      console.log('expand site')
    },
    ReadEntry: async function (event, containerId, entryIndex) {
      if (event.stopPropagation) { // prevent default action of a
        event.stopPropagation()
      }

      if (this.mode === 'showAll') { // no Read When showAll, just for insurance since read btn has not render in showAll mode
        return
      }

      // use filter to find index, since this.data.container also filtered, only isNoticed === false is left
      const containerIndex = this.data.container.reduce((acc, x, idx) => x.id === containerId ? idx : acc, -1)
      this.data.container[containerIndex].list.filter(e => e.id === entryIndex)[0].isNoticed = true
      this.data.container[containerIndex].unNoticedCount--

      const idx = `${containerIndex}|${entryIndex}`
      const url = '/read/' + encodeURIComponent(idx)
      console.log(`Fetch ${url}`)
      const resp = await fetch(url)
      if (resp.ok) {
        console.log('succuess')
      } else {
        console.log('failed to read ' + idx)
      }
    },
    ReadAllEntries: async function (event, containerId) {
      if (event.stopPropagation) { // prevent default action of a
        event.stopPropagation()
      }

      if (this.mode === 'showAll') {
        // skip
      } else {
        const containerIndex = this.data.container.reduce((acc, x, idx) => x.id === containerId ? idx : acc, -1)
        const unNoticedIndexes = this.data.container[containerIndex].list.reduce((acc, element) => {
          if (element.isNoticed === false) {
            return `${acc}&${element.id}`
          }
          return acc
        }, `${containerIndex}`)

        this.data.container[containerIndex].unNoticedCount = 0
        delete this.data.container[containerIndex].list

        const url = '/readAll/' + unNoticedIndexes
        console.log(`Fetch ${url}`)
        const resp = await fetch(url)
        if (resp.ok) {
          // setTimeout(this.refreshData, 1000 * 10)
          console.log('success')
        } else {
          console.log('failed to readAll')
        }
      }
    },
    PreviewImage: function (containerId, entryId) {
      const containerIndex = this.data.container.reduce((acc, x, idx) => x.id === containerId ? idx : acc, -1)
      const targetData = this.data.container[containerIndex].list.filter(e => e.id === entryId)[0]
      this.currentPreviewImg = targetData.img
      this.currentPreviewTitle = targetData.title
      this.currentPreviewHref = targetData.href
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-small-ex {
    height: 21px;
    line-height: 24px;
    padding: 0 0.5rem;
    margin-left: 0.5em;
    font-size: 0.8em;
    text-transform: capitalize;
}

.btn-small {
    height: 24px;
    line-height: 24px;
    padding: 0 0.5rem;
    /*font-size: 0.8em;*/
    text-transform: capitalize;
}

.collection .collection-item
{
    background-color: #313338;
}

.collapsible-header
{
    background-color: #d5d5d5;
}

.display-none {
    display: none;
}

.yrBtn {
    display: inline-block;
    width: 70px;
}
</style>
