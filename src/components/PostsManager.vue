<template>
  <div style="height: 100vh; padding-top:auto;">
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-geo-json :geojson="geojson"
                :options="options"/>
    </l-map>
  </div>
</template>

<script>
/* eslint-disable */
import {LMap, LTileLayer, LGeoJson, LMarker} from 'vue2-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker
  },
  data () {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      zoom: 8,
      center: [47.413220, -1.219482],
      bounds: null,
      geojson: null
    };
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
  onEachFeatureFunction() {
      return (feature, layer) => {
        layer.bindTooltip(
          "<div>code:" +
            feature.properties.code +
            "</div><div>nom: " +
            feature.properties.nom +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
  },
  },
  async created () {
    const response = await fetch('https://rawgit.com/gregoiredavid/france-geojson/master/regions/bretagne/communes-bretagne.geojson');
    const data = await response.json();
    this.geojson = data;
    this.loading = false;
  },
      methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    }
  }
};


</script>

<style>

</style>

