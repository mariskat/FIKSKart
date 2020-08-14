<script>
  /** file Cases.svelte
   *  page containing all cases for case holder, Trello-like overview
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Header from "./Header.svelte";
  import StandardCase from "./StandardCase.svelte";
  import { db, auth } from "../firebase.js";

  let caseProcessBarSource = "./images/caseProcessBar.png";
  let mapDrawingSource = "./images/mocked_mapdrawing.png";
  let closePopUpSource = "./images/closeAnimation.png";

  let isDisplayingDrawing = writable(false);
  let allCases = [];

  /** Listen to changes in map-eror and fetches all map-error cases **/
  db.ref("map-error").on("value", function(snapshot) {
    allCases = [];
    snapshot.forEach(function(childSnapshot) {
      allCases.push({
        key: childSnapshot.key,
        properties: childSnapshot.val()
      });
    });
  });

  /** Displaying map drawing for the pressed case **/
  function displayDrawing() {
    isDisplayingDrawing.set(true);
  }

  /** Displaying map drawing for the pressed case **/
  function closeDrawing() {
    isDisplayingDrawing.set(false);
  }
</script>

<style>
  /* Frames */
  mainContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: inherit;
  }
  casesAwaiting {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 57vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  newCases {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 57vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  casesInProgress {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 57vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  finishedCases {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 57vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  caseContainers {
    display: flex;
    flex-direction: row;
    margin-top: 3vh;
  }
  popUpWindowOuter {
    opacity: 10%;
    background: rgb(21, 114, 119);
    position: absolute;
    width: 100%;
    height: 100%;
  }
  popUpWindowInner {
    position: absolute;
    margin-top: 19%;
    margin-left: 37%;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    height: 50%;
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #e9e9e9;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #b2efec;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #60d0cb;
  }

  /* Images */
  img.caseProcessBar {
    height: 8vh;
    margin-top: 13vh;
  }
  img.mapDrawing {
    height: 53vh;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  img.closePopUp {
    width: 3vh;
  }

  /* Buttons */
  button.closePopUp {
    border: none;
    background: transparent;
    position: absolute;
    right: -25px;
    top: -19px;
  }
</style>

<main>
  <Header />

  {#if $isDisplayingDrawing}
    <popUpWindowOuter on:click={closeDrawing} />

    <popUpWindowInner>
      <button class="closePopUp" on:click={closeDrawing}>
        <img class="closePopUp" src={closePopUpSource} alt={closePopUpSource} />
      </button>
      <img class="mapDrawing" src={mapDrawingSource} alt={mapDrawingSource} />
    </popUpWindowInner>
  {/if}

  <mainContent>
    <img
      class="caseProcessBar"
      src={caseProcessBarSource}
      alt={caseProcessBarSource} />

    <caseContainers>
      <casesAwaiting>
        {#each allCases as { key, properties }}
          {#if properties.status === 'SUBMITTED'}
            <svelte:component
              this={StandardCase}
              caseID={key}
              reportedCase={properties}
              on:displayMap={displayDrawing} />
          {/if}
        {:else}
          <p>loading...</p>
        {/each}
      </casesAwaiting>

      <newCases>
        {#each allCases as { key, properties }}
          {#if properties.status == 'TAKEN' && auth.currentUser.uid == properties.case_handler}
            <svelte:component
              this={StandardCase}
              caseID={key}
              reportedCase={properties}
              on:displayMap={displayDrawing} />
          {/if}
        {/each}
      </newCases>

      <casesInProgress>
        {#each allCases as { key, properties }}
          {#if properties.status == 'INPROCESS' && auth.currentUser.uid == properties.case_handler}
            <svelte:component
              this={StandardCase}
              caseID={key}
              reportedCase={properties}
              on:displayMap={displayDrawing} />
          {/if}
        {/each}
      </casesInProgress>

      <finishedCases>
        {#each allCases as { key, properties }}
          {#if properties.status == 'CLOSED' && auth.currentUser.uid == properties.case_handler}
            <svelte:component
              this={StandardCase}
              caseID={key}
              reportedCase={properties}
              on:displayMap={displayDrawing} />
          {/if}
        {/each}
      </finishedCases>

    </caseContainers>
  </mainContent>
</main>
