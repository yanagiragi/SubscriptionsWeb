<template>
    <div>
        <div v-if="container.unNoticedCount > 0" class="collapsible-header" @click="$emit('expand-site')">
            <i class="material-icons">filter_drama</i>
            {{ type }} [ {{ container.nickname }} ]
            <span class="badge new">
                {{ container.unNoticedCount }}
            </span>
            <span
                class="btn btn-small-ex"
                @click="$emit('read-all-entries', $event, container.typeId)"
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
                                @click="$emit('read-entry', $event, container.id, entry.id)">
                                read
                            </a>
                        </div>

                        <div class="yrBtn">
                            <a v-if="entry.img != 'NULL'"
                                class="waves-effect waves-light btn btn-small modal-trigger"
                                href="#modal1"
                                @click="$emit('preview-image', container.id, entry.id)">
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
    </div>
</template>

<script>

export default {
  name: 'Collapsible',
  data () {
    return {
      currentPreviewTitle: 'PlaceHolder',
      currentPreviewImg: 'placeholder.png',
      currentPreviewHref: 'about:blank'
    }
  },
  props: [
    'container', 'type'
  ],
  mounted () {
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

.yrBtn {
    display: inline-block;
    width: 70px;
}

.collection .collection-item
{
    background-color: #313338;
}

.collapsible-header
{
    background-color: #d5d5d5;
}

</style>
