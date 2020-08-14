<script>
  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "leaflet-webatlastile";

  onMount(() => {
    let map = L.map("mapid").setView([59.9, 11], 13);

    new L.tileLayer.webatlas({
      apikey: "19cacf04-da91-45c5-a0bd-28613881d1a4",
      mapType: L.TileLayer.Webatlas.Type.VECTOR
    }).addTo(map);

    L.marker([59.9, 11])
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  });
</script>

<style>
  #mapid {
    height: 400px;
  }
</style>

<div id="mapid" />
