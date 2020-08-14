<script>
  /** file EditMap.svelte
   *  Page for editing drawings in map for case holder
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import * as L from "leaflet";
  import "leaflet-webatlastile";
  import "@geoman-io/leaflet-geoman-free";
  import { onMount } from "svelte";
  import { db } from "../firebase.js";
  import { translation } from "../Pages/Map/translation.js";

  export let status;
  export let polygonCoordinates;

  let map;
  let polylines = [];
  let actions = [];

  let animationSrc = "./videos/endreBygninger.mp4";
  let infoSrc = "./images/info.png";
  let leftArrowSrc = "./images/leftArrow.png";
  let rightArrowSrc = "./images/rightArrow.png";
  let closeAnimationSrc = "./images/closeAnimation.png";
  let infoAnimationSrc = "./images/info_animation.png";

  var changesMadeInEditMode = [];

  let infoTip = [false, false, false, false]; // Flags for toggling info-boxes
  let isAnimationShowing = true;
  export let letAnimationShow = false;

  /** Sets correct infotip to true and show infobox.
   *  param tipNum - Which index of booleans in infoTip to be toggled
   */
  function showHelpBox(tipNum) {
    infoTip[tipNum] = true;
  }

  /** Sets correct infotip to false and hide infobox.
   *  param tipNum - Which index of booleans in infoTip to be toggled
   */
  function hideHelpBox(tipNum) {
    infoTip[tipNum] = false;
  }

  onMount(() => {
    // Create map and set view
    map = L.map("mapid", {
      zoomControl: false
    }).setView([60.79952059419573, 11.031990051269533], 18);
    // Plug in to get Norkart map
    new L.tileLayer.webatlas({
      apikey: MAP_KEY,
      mapType: L.TileLayer.Webatlas.Type.VECTOR
    }).addTo(map);

    // Adding zoom control with custom options
    if (letAnimationShow) {
      moveZoomButtons("bottomright");
    }

    // Make map non-interactable if it is in summary
    if (!letAnimationShow) {
      disableMapInteraction();
    }

    // Draws polygon to map
    polygonCoordinates.forEach(element => {
      var polyline = L.polygon(element.coordinates, {
        color: "#60D0CB",
        fill: "rgba(96, 208, 203, 0.2)"
      }).addTo(map);
      // Zoom the map to the polygon
      map.fitBounds(polyline.getBounds());
      polylines.push(polyline);
    });
    if (status !== "CLOSED") {
      // Change layout of line being drawn
      const polygonOptions = {
        templineStyle: {
          color: "#60D0CB"
        },
        hintlineStyle: {
          color: "#60D0CB"
        },
        pathOptions: {
          color: "#60D0CB",
          fill: "rgba(96, 208, 203, 0.2)"
        }
      };

      map.pm.enableDraw("Polygon", polygonOptions); // Enable drawing-layout for polygons
      map.pm.disableDraw("Polygon");

      map.pm.Toolbar.createCustomControl({
        name: "undoLastChange",
        block: "custom",
        title: "Angre forrige endring",
        className: "customToolUndoLastChange",
        onClick: undoLastChange,
        toggle: false
      });

      // Disable action-popups when hovering over tools
      map.pm.Toolbar.changeActionsOfControl("Polygon", actions);
      map.pm.Toolbar.changeActionsOfControl("dragMode", actions);

      // Change tools showing
      map.pm.addControls({
        position: "bottomleft",
        drawControls: true,
        editControls: true,
        removalMode: false,
        dragMode: true,
        cutPolygon: true,
        drawCircle: false,
        drawCircleMarker: false,
        drawRectangle: false,
        drawMarker: false,
        drawPolyline: false,
        editMode: false,
        optionsControls: false,
        customControls: true,
        oneBlock: true,
        drawPolygon: true
      });

      map.pm.setLang("customName", translation, "en"); // Translate to norwegian

      // Disable action-popups from controls
      map.pm.Toolbar.changeActionsOfControl("editMode", actions);
      map.pm.Toolbar.changeActionsOfControl("Polygon", actions);
      map.pm.Toolbar.changeActionsOfControl("undoLastChange", actions);
      map.pm.Toolbar.changeActionsOfControl("cutPolygon", actions);
      map.pm.Toolbar.changeActionsOfControl("dragMode", actions);

      // Change order of controls
      map.pm.Toolbar.changeControlOrder([
        "Polygon",
        "cutPolygon",
        "dragMode",
        "customControls"
      ]);

      // Add drawn element to list
      map.on("pm:create", polygon => {
        changesMadeInEditMode.push(polygon);
      });

      map.on("pm:cut", polygon => {
        changesMadeInEditMode.push(polygon);
      });
    }
  });

  /** Toggles display of animation **/
  function toggleAnimation() {
    isAnimationShowing = !isAnimationShowing;
  }

  function disableMapInteraction() {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
  }

  // Update when coordinates of polygon are changed
  $: {
    if (map) {
      polylines.forEach(p => {
        map.removeLayer(p);
      });

      polygonCoordinates.forEach(element => {
        var polyline = L.polygon(element.coordinates, {
          color: "#60D0CB",
          fill: "rgba(96, 208, 203, 0.2)"
        }).addTo(map);
        // Zoom the map to the polygon
        map.fitBounds(polyline.getBounds());
        polylines.push(polyline);
      });
    }
  }

  function undoLastChange() {
    // Remove last element
    var removedLayer = changesMadeInEditMode.pop();

    if (changesMadeInEditMode.length > 0 && removedLayer) {
      // If it is a polygon, remove
      if (removedLayer.shape == "Polygon") {
        map.removeLayer(removedLayer.layer);
        // If it is a cutting object, change
      } else {
        map.removeLayer(removedLayer.layer);
        for (var i = changesMadeInEditMode.length - 1; i > -1; i--) {
          if (changesMadeInEditMode[i].shape == "Cut") {
            map.addLayer(changesMadeInEditMode[i].layer);
          }
        }
      }
    } else if (removedLayer) {
      if (removedLayer.shape == "Cut") {
        map.removeLayer(removedLayer.layer);
        polygonCoordinates.forEach(element => {
          var polyline = L.polygon(element.coordinates, {
            color: "#60D0CB",
            fill: "rgba(96, 208, 203, 0.2)"
          }).addTo(map);
          // Zoom the map to the polygon
          map.fitBounds(polyline.getBounds());
          polylines.push(polyline);
        });
      } else if (removedLayer.shape == "Polygon") {
        map.removeLayer(removedLayer.layer);
      }
    }
  }

  /** Decides position of zoom-buttons in map
   *  param pos - position wanted
   */
  function moveZoomButtons(pos) {
    L.control
      .zoom({
        position: pos
      })
      .addTo(map);
  }
</script>

<style>
  #mapid {
    width: 100%;
    height: 100%;
  }
  button.toggleAnimation {
    width: 31px;
    height: 32px;
    background: transparent;
    border: none;
    position: absolute;
    cursor: pointer;
    z-index: 100;
  }
  .animationWrapper {
    position: absolute;
    top: 297px;
    left: 130vh;
    width: 250px;
    height: 250px;
    background: transparent;
    z-index: 1200;
  }

  img.toggleAnimation {
    width: 31px;
    height: 32px;
    cursor: pointer;
  }
  .drawingAnimation {
    position: absolute;
    top: 19px;
    left: 18px;
    z-index: 50;
    width: 300px;
    height: 313px;
  }

  .drawingAnimation:focus {
    border: none;
  }

  .animationHelp {
    position: absolute;
    right: -53px;
    top: 10px;
  }
</style>

<div id="mapid" />
<div class="animationWrapper">
  <div class="animationHelp">
    {#if infoTip[3]}
      <smallNormalText class="submit-text">
        Klikk for å se animasjon
      </smallNormalText>
    {/if}
  </div>
  {#if isAnimationShowing && letAnimationShow}
    <button class="toggleAnimation" on:click={() => toggleAnimation()}>
      <img
        class="toggleAnimation"
        src={closeAnimationSrc}
        alt="Close Animation" />
    </button>
  {:else if !isAnimationShowing && letAnimationShow}
    <button
      class="toggleAnimation"
      on:mousemove={() => showHelpBox(3)}
      on:mouseout={() => hideHelpBox(3)}
      on:click={() => hideHelpBox(3)}
      on:click={() => toggleAnimation()}>

      <img
        class="toggleAnimation"
        src={infoAnimationSrc}
        alt="Info Animation" />
    </button>
  {/if}
  {#if isAnimationShowing && letAnimationShow}
    <div class="animation">
      <video
        autoplay
        loop
        class="drawingAnimation"
        name="Drawing video"
        src={animationSrc} />
    </div>
  {/if}
</div>
