<template>
  <div style="height: 100vh; padding-top:auto;">
      <div class="col-md-3">
      <div
        class="form-check"
        v-for="layer in layers"
        :key="layer.id"
      >
        <label class="form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="layer.active"
            @change="layerChanged(layer.id, layer.active)"
          />
          {{ layer.name }}
        </label>
      </div>
    </div>
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
      <l-geo-json :geojson="layers[0].data" :options="options" :fillColor="fillColor"/>
      <l-geo-json :geojson="layers[1].data" :options="options"/>
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
    this.initMap();
    // this.initLayers();
    },
  onEachFeatureFunction() {
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
    console.log(l)
    const response = await fetch(`https://rawgit.com/gregoiredavid/france-geojson/master/regions/${l.name}/communes-${l.name}.geojson`);
    let data = await response.json();
    l.data = data;
    });
  },
      methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
        console.log(this);
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
    async initLayers() {
      this.layers.forEach((layer) => {
        const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
        const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
        
        markerFeatures.forEach((feature) => {
          feature.coords = L.marker(feature.geometry.coordinates)
            .bindPopup(feature.name);
        });
        
        polygonFeatures.forEach((feature) => {
          feature.coords = L.polygon(feature.geometry.coordinates)
            .bindPopup(feature.name);
        });
      });
    },
    initMap() {
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
      this.tileLayer.addTo(this.map);
    },
  }
};

</script>

<style>

</style>

