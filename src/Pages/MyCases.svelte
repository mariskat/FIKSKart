<script>
  /** file MyCases.svelte
   *  My cases page, showing updated reported caselist, info about them and status of them.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Header from "../Header/Header.svelte";
  import UserStandardCase from "../Pages/UserStandardCase.svelte";
  import { db, auth } from "../firebase.js";

  let caseProcessBarSource = "./images/caseProcessBar.png";
  let mapDrawingSource = "./images/mocked_mapdrawing.png";
  let closePopUpSource = "./images/closeAnimation.png";
  let infoSource = "./images/info.png";
  let myCasesSource = "./images/my_cases_bar.png";

  let isDisplayingDrawing = writable(false);
  let allCases = [];
  let infoTip = [false]; // Flags for toggling info-boxes

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

  /** Shows drawing created by user by toggling its flag **/
  function displayDrawing() {
    isDisplayingDrawing.set(true);
  }

  /** Closes drawing created by user by toggling its flag **/
  function closeDrawing() {
    isDisplayingDrawing.set(false);
  }

  /** Listens for changes in reported cases (map-error)
   * and fetches all reported cases
   */
  db.ref("map-error").on("value", function(snapshot) {
    allCases = [];
    snapshot.forEach(function(childSnapshot) {
      allCases.push({
        key: childSnapshot.key,
        properties: childSnapshot.val()
      });
    });
  });
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
    height: 46vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  newCases {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 46vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  casesInProgress {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 46vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  finishedCases {
    display: flex;
    flex-direction: column;
    width: 34vh;
    height: 46vh;
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
    margin-top: 13%;
  }
  elementWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4vh;
    margin-top: 10vh;
    height: 2vh;
    margin-left: 30vh;
  }
  .help-box {
    width: 29vh;
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
  img.mapDrawing {
    height: 53vh;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  img.myCases {
    height: 8vh;
    margin-top: 3vh;
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
  <elementWrapper>
    <titleFrame>
      <title>Mine saker</title>
      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Her kan du se en oversikt over dine saker. Klikk på info-knappene
            for å se dine saksdetaljer.
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>
    <img class="myCases" src={myCasesSource} alt="my cases icon" />
    {#if $isDisplayingDrawing}
      <popUpWindowOuter on:click={closeDrawing} />

      <popUpWindowInner>
        <button class="closePopUp" on:click={closeDrawing}>
          <img
            class="closePopUp"
            src={closePopUpSource}
            alt={closePopUpSource} />
        </button>
        <img class="mapDrawing" src={mapDrawingSource} alt={mapDrawingSource} />
      </popUpWindowInner>
    {/if}

    <mainContent>
      <caseContainers>
        <casesAwaiting>
          {#each allCases as { key, properties }}
            {#if properties.status === 'SUBMITTED' && auth.currentUser.uid == properties.user_id}
              <svelte:component
                this={UserStandardCase}
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
            {#if properties.status === 'TAKEN' && auth.currentUser.uid == properties.user_id}
              <svelte:component
                this={UserStandardCase}
                caseID={key}
                reportedCase={properties}
                on:displayMap={displayDrawing} />
            {/if}
          {/each}
        </newCases>

        <casesInProgress>
          {#each allCases as { key, properties }}
            {#if properties.status === 'INPROCESS' && auth.currentUser.uid == properties.user_id}
              <svelte:component
                this={UserStandardCase}
                caseID={key}
                reportedCase={properties}
                on:displayMap={displayDrawing} />
            {/if}
          {/each}
        </casesInProgress>

        <finishedCases>
          {#each allCases as { key, properties }}
            {#if properties.status === 'CLOSED' && auth.currentUser.uid == properties.user_id}
              <svelte:component
                this={UserStandardCase}
                caseID={key}
                reportedCase={properties}
                on:displayMap={displayDrawing} />
            {/if}
          {/each}
        </finishedCases>
      </caseContainers>
    </mainContent>
  </elementWrapper>
</main>
