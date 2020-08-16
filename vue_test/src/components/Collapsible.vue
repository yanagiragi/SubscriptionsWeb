<template>
    <ul v-if="mode === 'showUnNoticedOnly'" class="collapsible collection" data-collapsible="accordion">
        <li v-for="container in data.containerList" :key="container.id">
            <div v-if="container.unNoticedCount > 0" class="collapsible-header" @click="ExpandSite">
                <i class="material-icons">filter_drama</i>
                {{ data.types[container.id] }} [ {{ container.nickname }} ]
                <span class="badge new">
                    {{ container.unNoticedCount }}
                </span>
                <span class="btn btn-small-ex" v-on:click="ReadAllEntries" v-bind:value="container.id">
                    read all
                </span>
            </div>

            <div v-if="container.unNoticedCount > 0" class="collapsible-body">
                <ul class="collection">
                    <li v-for="entry in container.list" :key="entry.id">
                        <div v-if="entry.isNoticed == false">
                            <div class="yrBtn">
                                <a class="waves-effect waves-light btn btn-small modal-trigger"
                                    href="#"
                                    v-bind:value="container.id + '|' + entry.id"
                                    @click="ReadEntry">
                                    read
                                </a>
                            </div>

                            <div class="yrBtn">
                                <a v-if="entry.img != 'NULL'"
                                    class="waves-effect waves-light btn btn-small modal-trigger"
                                    href="#modal1"
                                    v-bind:value="`${container.id}|${entry.id}`"
                                    @click="$emit('show-modal', `${container.id}|${entry.id}`)">
                                    preview
                                </a>
                            </div>

                            <a v-bind:href="entry.href" target="_blank" class="collection-item" style="margin-left: 30px; display: inline-block; width: calc(100vw - 232px); text-align: left;">
                                {{ entry.title }}
                            </a>
                        </div>

                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script>
import M from 'materialize-css'

export default {
  name: 'Collapsible',
  data () {
    return {
      mode: 'showUnNoticedOnly',
      data: {
        types: [
          'type 1'
        ],
        containerList: [
          {
            nickname: 'nick 1',
            unNoticedCount: 1,

            list: [
              {
                id: 0,
                title: 'test',
                src: '',
                href: 'https://www.google.com.tw',
                isNoticed: false
              }
            ],
            id: 0
          }
        ]
      }
    }
  },
  props: {
    mobileMode: Boolean
  },
  mounted () {
    const elems = document.querySelectorAll('.collapsible')
    const options = {}
    M.Collapsible.init(elems, options)
  },
  methods: {
    ExpandSite: function () {
      console.log('expand site')
    },
    ReadEntry: function () {
      alert('123')
    },
    ReadAllEntries: function () {
      alert('123')
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
