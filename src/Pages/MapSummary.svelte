<script>
  /** file MapSummary.svelte
   *  Map and drawing created by user to be displayed in summary.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import * as L from "leaflet";
  import "leaflet-webatlastile";
  import "@geoman-io/leaflet-geoman-free";
  import { onMount } from "svelte";
  import { polygons } from "../store.js";

  let map;

  onMount(() => {
    // Create map and set view (remove zoomcontrols in the process)
    map = L.map("mapid", {
      zoomControl: false
    }).setView([60.79952059419573, 11.031990051269533], 18);

    // Plug in
    new L.tileLayer.webatlas({
      apikey: MAP_KEY,
      mapType: L.TileLayer.Webatlas.Type.VECTOR
    }).addTo(map);

    // Disable opportunities to interact with map
    disableMapInteraction();

    $polygons.forEach(element => {
      var polygon = L.polygon(element.coordinates, {
        color: "#60D0CB",
        fill: "rgba(96, 208, 203, 0.2)"
      }).addTo(map);

      // zoom the map to the polygon
      map.fitBounds(polygon.getBounds());
    });
  });

  function disableMapInteraction() {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }
</script>

<style>
  #mapid {
    width: 100%;
    height: 100%;
  }
</style>

<div id="mapid" />
