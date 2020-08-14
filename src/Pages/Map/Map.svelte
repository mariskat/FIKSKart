<script>
  /** file Summary.svelte
   *  Page showing map with drawingfunctionalities and animations for reporting error
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import * as L from "leaflet";
  import { onMount } from "svelte";
  import "leaflet-webatlastile";
  import "@geoman-io/leaflet-geoman-free";
  import { Link, navigate } from "svelte-routing";
  import Header from "../../Header/Header.svelte";
  import Documentation from "../Documentation.svelte";
  import MapSearch from "./MapSearch.svelte";
  import ProgressBar from "../ProgressBar.svelte";
  import * as animateScroll from "svelte-scrollto";
  import { getData, getDatasets } from "./fetchMapData.js";
  import { writable } from "svelte/store";
  import { translation } from "./translation.js";
  import { storeCategory, polygons, isSummaryDisabled } from "../../store.js";

  let latlngs;
  let scrollContainer;
  let bottomElement;
  let currentBbox;
  let map;
  let originalLayer;
  let animationSrc;

  let imgIndex = 0;
  let featuregroup = 0;
  let isDisabled = true;
  let searched = false;
  let clickedLayer = false;
  let isAnimationShowing = false;
  const isToolShowing = writable(false);
  const isMapApproved = writable(false);

  let actions = [];
  var selectedPolygons = [];
  var drawnElement = [];
  var editedElements = [];
  var changesMadeInEditMode = [];

  let infoMsgOnSearchBar = "Søk på adressen der du ønsker å melde en feil";
  let infoSrc = "./images/info.png";
  let leftArrowSrc = "./images/leftArrow.png";
  let rightArrowSrc = "./images/rightArrow.png";
  let closeAnimationSrc = "./images/closeAnimation.png";
  let infoAnimationSrc = "./images/info_animation.png";

  let editableLayers = new L.FeatureGroup();
  let drawnLayers = new L.FeatureGroup();

  let infoTip = [false, false, false, false]; // Flags for toggling info-boxes
  let nextStep = false; // Flag for toggling steps in progressbar

  let limit = 5; // Set limit on map
  let startView = [60.79952059419573, 11.031990051269533]; // Set random startview on map

  onMount(() => {
    // After 3 seconds on page, show help for addressearch
    setTimeout(() => {
      showHelpBox(1);
    }, 3000);

    // Create map and set view
    map = L.map("mapid", {
      zoomControl: false
    }).setView(startView, limit);

    // Plug in to get Norkart map
    new L.tileLayer.webatlas({
      apikey: MAP_KEY,
      mapType: L.TileLayer.Webatlas.Type.VECTOR
    }).addTo(map);

    map.addLayer(editableLayers);
    map.addLayer(drawnLayers);

    // Adding zoom control with custom options
    moveZoomButtons("bottomright");

    // Change tools showing
    map.pm.addControls({
      position: "bottomleft",
      drawControls: false,
      editControls: false,
      dragMode: false,
      optionsControls: false,
      customControls: false,
      oneBlock: true
    });
  });

  /** Function for getting to first hard-coded address. **/
  function findFirstAddress() {
    limit = 18;
    startView = [60.79952059419573, 11.031990051269533];
    map.setView(startView, limit);
    removeLayers();
    startDrawing();
  }

  /** Function for getting to second hard-coded address.**/
  function findSecAddress() {
    limit = 20;
    startView = [60.80051187678577, 11.053343283526635];
    map.setView(startView, limit);
    removeLayers();
    startDrawing();
  }

  /** Sets correct infotip to true and show infobox.
   *  param tipNum - Which index of booleans in infoTip to be toggled
   */
  function showHelpBox(tipNum) {
    if (tipNum == 1 && searched) {
      infoTip[tipNum] = false;
    } else {
      infoTip[tipNum] = true;
    }
  }

  /** Sets correct infotip to false and hide infobox.
   *  param tipNum - Which index of booleans in infoTip to be toggled
   */
  function hideHelpBox(tipNum) {
    infoTip[tipNum] = false;
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

  /** Gets exact coordinates from what is displayed in Leaflet Map **/
  function leafletBboxCoordinates() {
    var bounds = map.getBounds();
    let bbox =
      bounds._southWest.lat +
      "," +
      bounds._southWest.lng +
      "," +
      bounds._northEast.lat +
      "," +
      bounds._northEast.lng;
    return bbox;
  }

  /** Displays animation and drawing controls for
   * your purpose - after address is found.
   */
  function startDrawing() {
    // Make sure user doesn't request drawing of data too far out
    limit = map.getZoom();
    if (limit > 16) {
      searched = true;
      // Show tools corresponding to chosen task
      if ($storeCategory == "Bygg, Endre bygg i kart") {
        if (!$isToolShowing) {
          animationSrc = "./videos/endreBygninger.mp4";
          changeBuilding();
        }
        drawPolygonsOnMap();
      } else if ($storeCategory == "Bygg, Fjerne bygg fra kart") {
        if (!$isToolShowing) {
          animationSrc = "./videos/rivBygning.mp4";
          demolishBuilding();
        }
        drawPolygonsOnMap();
      } else {
        animationSrc = "./videos/leggTilBygning.mp4";
        if (!$isToolShowing) {
          addBuilding();
          addBuildingControls();
        } else {
          addBuilding();
        }
      }
    } else {
      searched = false;
      infoMsgOnSearchBar = "Zoom nærmere inn på kartet for å hente bygg";
    }
  }

  /** Creates custom controls and other tools necessary
   * for reporting a demolished buiilding
   */
  function demolishBuilding() {
    isAnimationShowing = true; // Show animation
    isToolShowing.set(true); // Show toolbar

    map.pm.setLang("customName", translation, "en"); // Translate to norwegian

    // Add custom tool for undo
    map.pm.Toolbar.createCustomControl({
      name: "Undo",
      block: "custom",
      title: "Angre forrige valg",
      className: "customToolUndo",
      onClick: undoChanges,
      toggle: false
    });

    // Change tools showing
    map.pm.addControls({
      position: "bottomleft",
      drawControls: false,
      editControls: false,
      optionsControls: false,
      customControls: true,
      oneBlock: true
    });
  }

  /** Creates a custom control and detecting (and adding to list) drawn and cutted elements **/
  function changeBuilding() {
    isToolShowing.set(true); // Show animation
    isAnimationShowing = true; // Show toolbar

    map.pm.setLang("customName", translation, "en"); // Translate to norwegian

    // Add custom tool for undoing last changes
    map.pm.Toolbar.createCustomControl({
      name: "undoLastChange",
      block: "custom",
      title: "Angre forrige endring",
      className: "customToolUndoLastChange",
      onClick: undoLastChange,
      toggle: false
    });

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

    let counter = 0;
    map.on("pm:cut", polygon => {
      counter = counter + 1;
      if (counter == 1) {
        originalLayer = polygon.originalLayer;
      }
      // Replace cutted element
      if (editedElements.length != 0) {
        editedElements.pop();
      }
      changesMadeInEditMode.push(polygon);
      editedElements.push(polygon.layer);
    });
  }

  /** Adds custom controls to map when adding a building **/
  function addBuildingControls() {
    // Add custom tool for undo
    map.pm.Toolbar.createCustomControl({
      name: "Undo",
      block: "custom",
      title: "Angre forrige valg",
      className: "customToolUndo",
      onClick: undoLastChange,
      toggle: false
    });
  }

  /** Adds controls to map when changing a building **/
  function changeBuildingAddControls() {
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
    map.pm.disableDraw("Polygon"); // Disable actually drawing before clicking tool

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
  }

  /** Adds controls to map and detects creation of polygons on map (add to list) **/
  function addBuilding() {
    isAnimationShowing = true; // Show animation
    isToolShowing.set(true); // Show toolbar

    // Change layout of line being drawn
    const options = {
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

    map.pm.enableDraw("Polygon", options); // Enable drawing-layout for polygons

    // Disable action-popups when hovering over tools
    map.pm.Toolbar.changeActionsOfControl("Polygon", actions);
    map.pm.Toolbar.changeActionsOfControl("dragMode", actions);

    map.pm.Toolbar.changeControlOrder(["Polygon", "dragMode", "removalMode"]); // Changing order of controlbuttons

    map.pm.setLang("customName", translation, "en"); // Translate helper-text to norwegian

    // Change tools showing
    map.pm.addControls({
      position: "bottomleft",
      drawControls: true,
      editControls: true,
      editMode: false,
      dragMode: true,
      cutPolygon: false,
      optionsControls: false,
      customControls: true,
      drawPolygon: true,
      removalMode: false,
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: false,
      drawCircle: false,
      oneBlock: true
    });

    // Add drawn element to list
    map.on("pm:create", polygon => {
      drawnElement.push(polygon.layer);
      // Add drawn element to drawnLayers (featuregroup)
      map.addLayer(drawnLayers);
      drawnLayers.addLayer(polygon.layer);

      // Disable and enable button for continuing
      if (drawnElement.length != 0) {
        isDisabled = false;
      } else {
        isDisabled = true;
      }
    });
  }

  /** Draws all polygons that are fetched from NGIS-OpenAPI **/
  function drawPolygonsOnMap() {
    var polygons = [];

    // Remove all layers
    if (featuregroup) {
      map.removeLayer(featuregroup);
    }

    featuregroup = L.featureGroup().addTo(map); // Add a featuregroup to map

    let bbox = leafletBboxCoordinates(); // Get bbox-coordinates from map

    // Request data from API
    let result = getData(bbox).then(data => {
      return data;
    });

    // Iterate through data to find polygons
    result.then(data => {
      var polCoordinates = data.features;
      polCoordinates.forEach(e => {
        if (e.geometry.type == "Polygon") {
          // Get lokalID and coordinates for each polygon inside bbox area
          var localID = e.properties.identifikasjon.lokalId;
          var coordinates = e.geometry.coordinates;
          var linestringID = e.geometry_properties.exterior;

          // Add polygon layers to featuregroup
          var polygon = L.polygon(coordinates, {
            color: "grey"
          });
          polygon.addTo(featuregroup);
          var leafletID = polygon._leaflet_id;

          // Write lokalID, corresponding coordinates and localID for overlapped linestrings to dictionary
          polygons.push({
            leafletID: leafletID,
            lokalID: localID,
            coordinates: coordinates,
            lineStringID: linestringID
          });
        }
      });

      // Mouseon event highlights the layer
      featuregroup.eachLayer(function(layer) {
        layer.on("mouseover", function() {
          if (
            selectedPolygons.length == 0 &&
            changesMadeInEditMode.length == 0
          ) {
            this.bindTooltip("Klikk på bygget for å markere").openTooltip();
            this.setStyle({
              color: "#60D0CB",
              fill: "rgba(96, 208, 203, 0.2)"
            });
          } else {
            this.unbindTooltip();
          }
        });
      });

      // Mouseout event makes building grey again
      featuregroup.eachLayer(function(layer) {
        layer.on("mouseout", function() {
          polygons.forEach(e => {
            // If element is clicked, push to list of chosen elements
            if (
              e.leafletID == this._leaflet_id &&
              !selectedPolygons.includes(this) &&
              changesMadeInEditMode.length == 0
            ) {
              this.setStyle({
                color: "grey"
              });
            }
          });
        });
      });

      // Layer on-click returns id of polygon-layer clicked
      featuregroup.eachLayer(function(layer) {
        layer.on("click", function() {
          polygons.forEach(e => {
            // If element is clicked, push to list of chosen elements
            if (
              e.leafletID == this._leaflet_id &&
              !selectedPolygons.includes(e)
            ) {
              clickedLayer = true;
              selectedPolygons.push(e);
              changesMadeInEditMode.push(e);
              this.setStyle({
                color: "#60D0CB",
                fill: "rgba(96, 208, 203, 0.2)"
              });
              // If element already in list, remove and change color
            } else if (
              selectedPolygons.includes(e) &&
              e.leafletID == this._leaflet_id
            ) {
              clickedLayer = false;
              this.setStyle({
                color: "grey"
              });

              // Remove element from list if clicked twice
              for (var i = selectedPolygons.length - 1; i >= 0; i--) {
                if (selectedPolygons[i] === e) {
                  selectedPolygons.splice(i, 1);
                }
              }
            }
          });
          // Disable and enable button
          if (selectedPolygons.length != 0) {
            isDisabled = false;
          } else {
            isDisabled = true;
          }

          // Add controls in editmode if layer is selected
          if (
            $storeCategory == "Bygg, Endre bygg i kart" &&
            selectedPolygons.length != 0
          ) {
            changeBuildingAddControls();
          }
        });
      });
    });
  }

  /** Pops selected layer from list, in the case of undoing changes of selection **/
  function undoChanges() {
    changesMadeInEditMode.pop();
    if (!featuregroup) {
      isDisabled = true;
    } else {
      featuregroup.setStyle({ color: "grey" });
      isDisabled = true;
    }
    let removeDrawing = drawnElement.pop();
    drawnLayers.removeLayer(removeDrawing);
    selectedPolygons = [];
  }

  /** Undoing last change made in edit mode **/
  function undoLastChange() {
    var removedLayer = changesMadeInEditMode.pop(); // Remove last element
    if (changesMadeInEditMode.length < 1) {
      undoChanges();

      // Enable drawing-layout for polygons
      map.pm.disableDraw("Polygon");
      // Remove selected object from list
      changesMadeInEditMode.pop();

      if ($storeCategory == "Bygg, Endre bygg i kart") {
        // Add leaflet-geoman controls with some options to the map
        map.pm.addControls({
          editMode: false,
          dragMode: false,
          removalMode: false,
          drawPolygon: false,
          cutPolygon: false,
          customControls: false
        });
      }
    } else {
      // If it is a polygon -> remove
      if (removedLayer.shape == "Polygon") {
        map.removeLayer(removedLayer.layer);
        // If it is a cutting object -> change
      } else {
        map.removeLayer(removedLayer.layer);

        let countCuts = 0;
        for (var i = changesMadeInEditMode.length - 1; i > 0; i--) {
          if (changesMadeInEditMode[i].shape == "Cut") {
            countCuts = countCuts + 1;
            map.addLayer(changesMadeInEditMode[i].layer);
          } else if (changesMadeInEditMode[i].shape == "Polygon") {
            countPolys = countPolys++;
          }
        }

        if (countCuts < 1) {
          map.addLayer(originalLayer);
        }
      }
    }
  }

  /** Saves drawn, changed or selected polygons to
   * polygons in store to be saved to Firebase
   */
  function savePolygons() {
    if (changesMadeInEditMode.length != 0) {
      // Get all drawn elements from updated list
      for (var i = changesMadeInEditMode.length - 1; i > 0; i--) {
        if (changesMadeInEditMode[i].shape == "Polygon") {
          editedElements.push(changesMadeInEditMode[i].layer);
        }
      }
    }
    if (drawnElement.length !== 0) {
      let rawLeafletPolygons = [...drawnElement];
      let firebasePolygons = rawLeafletPolygons.map(p => ({
        coordinates: p._latlngs
      }));
      polygons.set(firebasePolygons);
    } else if (editedElements.length != 0) {
      let rawLeafletPolygons = [...editedElements];
      let firebasePolygons = rawLeafletPolygons.map(p => ({
        coordinates: p._latlngs
      }));
      polygons.set(firebasePolygons);
    } else {
      polygons.set(selectedPolygons);
    }
  }

  /** Scrolling down when accepting mapdrawing **/
  function scrollDown() {
    animateScroll.scrollTo({
      element: bottomElement,
      container: scrollContainer
    });
    imgIndex = 1;
  }

  /** Scrolling up when backbutton is pressed **/
  function scrollUp() {
    animateScroll.scrollToTop({ container: scrollContainer });
    imgIndex = 0;
  }

  /** Toggles display of help-animation **/
  function toggleAnimation() {
    isAnimationShowing = !isAnimationShowing;
  }

  /** Removes all layers from map and draw new map **/
  function removeLayers() {
    if (featuregroup) {
      map.removeLayer(featuregroup);
    }
    map.eachLayer(function(layer) {
      map.removeLayer(layer);
    });

    // Plug in to get Norkart`s map
    new L.tileLayer.webatlas({
      apikey: MAP_KEY,
      mapType: L.TileLayer.Webatlas.Type.VECTOR
    }).addTo(map);

    changesMadeInEditMode = [];
    undoLastChange();
  }
</script>

<style>
  /* Map */
  #mapid {
    width: 100%;
    height: 100%;
  }

  /* Frames */
  .mapWrapper {
    width: 73%;
    margin-bottom: 1vh;
    margin-top: 5vh;
    height: 54vh;
    position: relative;
  }
  .mapSearchWrapper {
    position: absolute;
    z-index: 400;
    top: 0px;
    width: 100%;
    height: min-content;
  }
  mainContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  titleFrame {
    display: flex;
    flex-direction: row;
    margin-bottom: 5vh;
    margin-top: 8vh;
    height: 2vh;
    align-items: center;
    width: fit-content;
  }
  pageView {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
  centerContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    align-items: center;
  }
  innerVerticalContent {
    display: flex;
    flex-direction: column;
    width: inherit;
    margin-left: 20%;
  }
  content {
    flex-grow: 1;
    width: 641px;
  }
  .help-box {
    width: 200px;
  }
  infoBox {
    width: 200px;
    position: absolute;
    bottom: 74px;
    right: 36px;
    z-index: 20000000;
  }

  /* Documentation page */
  .documentation {
    margin-top: 57vh;
  }
  navigationButtons {
    width: fit-content;
    height: max-content;
    align-self: flex-end;
  }
  .approvePair {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  /* Animation */
  .animationWrapper {
    position: absolute;
    right: -151px;
    top: 22px;
    width: 250px;
    height: 250px;
    background: transparent;
    z-index: 1200;
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

  /* Images */
  img.toggleAnimation {
    width: 31px;
    height: 32px;
    cursor: pointer;
  }
  img.rightArrow {
    margin-left: 8vh;
  }
  img.rightArrow-next {
    margin-left: 11vh;
  }

  /* Buttons */
  button.toggleAnimation {
    width: 31px;
    height: 32px;
    background: transparent;
    border: none;
    position: absolute;
    cursor: pointer;
    z-index: 100;
  }
</style>

<main>
  <Header />
  <infoBox>
    {#if isDisabled}
      <div class="help-box">
        {#if infoTip[2]}
          <smallNormalText class="submit-text">
            Søk etter adresse og marker bygget før du kan fortsette
          </smallNormalText>
        {/if}
      </div>
    {/if}
  </infoBox>

  <mainContent>
    <verticalBar>
      <ProgressBar map={true} toggleUndercategory={!nextStep} />
    </verticalBar>

    <centerContent bind:this={scrollContainer}>

      <pageView on:click={() => showHelpBox(1)}>
        <innerVerticalContent>

          <titleFrame>
            <title>Søk på adressen og marker så bygget</title>
            <button
              class="info"
              on:mousemove={() => showHelpBox(0)}
              on:mouseout={() => hideHelpBox(0)}>
              <img class="info" src={infoSrc} alt="" />
            </button>
            <div class="help-box">
              {#if infoTip[0]}
                <smallNormalText class="submit-text">
                  Finn det du vil endre i kartet ved å søke etter adresse, eller
                  ved å dra kartet dit du vil. Marker deretter dine endringer.
                </smallNormalText>
              {/if}
            </div>
          </titleFrame>

          <div class="mapWrapper">
            <div class="animationWrapper">
              <div class="animationHelp">
                {#if infoTip[3]}
                  <smallNormalText class="submit-text">
                    Klikk for å se animasjon
                  </smallNormalText>
                {/if}
              </div>
              {#if $isToolShowing && isAnimationShowing}
                <button
                  class="toggleAnimation"
                  on:click={() => toggleAnimation()}>
                  <img
                    class="toggleAnimation"
                    src={closeAnimationSrc}
                    alt="Close Animation" />
                </button>
              {:else if $isToolShowing}
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
              {#if isAnimationShowing}
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
            <div id="mapid" />
            <div class="mapSearchWrapper">
              <infoRow>
                <MapSearch
                  on:firstAddressSearched={findFirstAddress}
                  on:secAddressSearched={findSecAddress}
                  on:findThisArea={startDrawing}
                  on:cancelAddress={removeLayers}
                  on:goToAddress={map.setView(startView, limit)} />
                <div class="help-box">
                  {#if infoTip[1]}
                    <smallNormalText class="submit-text">
                      {infoMsgOnSearchBar}
                    </smallNormalText>
                  {/if}
                </div>
              </infoRow>
            </div>
          </div>
          {#if !$isMapApproved}
            <navigationButtons class="approvePair">
              <nav>
                <Link to="kategori">
                  <button
                    class="backButton"
                    on:click={() => animateScroll.scrollToTop()}>
                    <backButtonText>
                      <img
                        class="backArrow"
                        src={leftArrowSrc}
                        alt="Back arrow" />
                      <smallBoldText>Tilbake</smallBoldText>
                    </backButtonText>
                  </button>
                </Link>
              </nav>
              <button
                class="nextButton"
                class:error={isDisabled}
                on:mousemove={() => showHelpBox(2)}
                on:mouseout={() => hideHelpBox(2)}
                on:click={() => {
                  nextStep = true;
                  savePolygons();
                  if (!isDisabled) {
                    scrollDown();
                  }
                }}
                on:click={() => {
                  if (!isDisabled) {
                    isMapApproved.set(true);
                  }
                }}>
                <nextButtonText>
                  <smallBoldText>Godkjenn</smallBoldText>
                  <img
                    class="rightArrow"
                    src={rightArrowSrc}
                    alt="Next arrow" />
                </nextButtonText>
              </button>
            </navigationButtons>
          {/if}
        </innerVerticalContent>
      </pageView>

      <pageView>
        <innerVerticalContent>
          <content>
            <div class="documentation">
              <Documentation on:scrollDown={scrollDown} />
              <br />
              <br />

            </div>
          </content>
          <navigationButtons>
            <button
              class="backButton"
              bind:this={bottomElement}
              on:click={() => {
                setTimeout(() => {
                  isMapApproved.set(false);
                }, 300);
              }}
              on:click={() => {
                scrollUp();
                nextStep = false;
              }}>
              <backButtonText>
                <img class="backArrow" src={leftArrowSrc} alt="Back arrow" />
                <smallBoldText>Tilbake</smallBoldText>
              </backButtonText>
            </button>
            <nav>
              <Link to="/oppsummering">
                <button
                  class="nextButton"
                  on:click={() => {
                    isSummaryDisabled.update(n => (n = false));
                  }}>
                  <nextButtonText>
                    <smallBoldText>Neste</smallBoldText>
                    <img
                      class="rightArrow-next"
                      src={rightArrowSrc}
                      alt="Next arrow" />
                  </nextButtonText>
                </button>
              </Link>
            </nav>
          </navigationButtons>
        </innerVerticalContent>
      </pageView>
    </centerContent>
  </mainContent>
</main>
