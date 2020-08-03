<template>
  <div style="height: 100vh; padding-top:auto;">
      <label for="checkboxTooltip">Activer la popup</label>
      <input
        id="checkboxTooltip"
        v-model="enableTooltip"
        type="checkbox"
      >
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="center"
      :layers="layers"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
			<l-geo-json v-for="(layer, index) in layers"
          :key="index"
          :geojson="layer.data"
          :options="options" 
          :options-style="getColor(layer)"
          :name="layer.name"/>
    </l-map>
  </div>
</template>

<script>
/* eslint-disable */
import {LMap, LTileLayer, LGeoJson, LMarker, LGeojson} from 'vue2-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
  },
  data () {
    return {
      map:null,
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      enableTooltip: true,
      zoom: 8,
      tileLayer: null,
      center: [47.713220, -2.819482],
      bounds: null,
      layers: [
          {
              id:0,
              data:null,
              active: false,
              fillColor: "#e4ce7f",
              name: "bretagne"
           },
          {
              id:1,
              data:null,
              active: false,
              fillcolor: "#ce7f84",
              name : "normandie"
          }
      ],
      fillColor: "#e4ce7f",

    };
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
  onEachFeatureFunction() {
      if (!this.enableTooltip) {
        return () => {};
      }
      return (feature, layer) => {
        layer.bindTooltip(
          "<div>Code : " +
            feature.properties.code +
            "</div><div> Nom : " +
            feature.properties.nom +
            "</div>",
          { permanent: false, sticky: true }
        );
      };
  },
  },
  async created () {
    this.layers.forEach(async (l) =>{
    const response = await fetch(`https://rawgit.com/gregoiredavid/france-geojson/master/regions/${l.name}/communes-${l.name}.geojson`);
    let data = await response.json();
    l.data = data;
    });
  },
    methods: {
    getColor(layer){
      return layer.name == "normandie"
        ?{
            color:'white',
            fillColor:"#ce7f84",
            weight: 0.5,
            fillOpacity: 0.7,
            }
        :{
            color:'white',
            fillColor:"#e4ce7f",
            weight: 0.5,
            fillOpacity: 0.7,
            }},
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    },
    async layerChanged(layerId, active) {
      const layer = this.layers.find(layer => layer.id === layerId);
      
      layer.data.features.forEach((feature) => {
        if (active) {
          L.polygon(feature.geometry.coordinates).addTo(this.LMap);
        } else {
          L.polygon(feature.geometry.coordinates).removeFrom(this.LMap);
        }
      });
    },
  }
};

</script>

<style>

</style>

