<script>
  /** file StandardCaseUser.svelte
   *  Framework for one case to be displayed in My Cases
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { writable } from "svelte/store";
  import { auth, db } from "../firebase.js";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  let caseInfoSource = "./images/caseInfo.png";
  let smallMapSource = "./images/dummyMapDrawingSmall.png";

  export let caseID;
  export let reportedCase;

  let display = "notDefined";
  const isInfoPressed = writable(false);
  const dispatch = createEventDispatcher();

  let optionIcons = [
    {
      id: "Bygg, Legg til bygg i kart",
      src: "./images/addBuilding.png"
    },
    {
      id: "Bygg, Fjerne bygg fra kart",
      src: "./images/demolishBuilding.png"
    },
    {
      id: "Bygg, Endre bygg i kart",
      src: "./images/changeBuilding.png"
    }
  ];

  /** Displaying expanded window when info clicked
   *  param uid - UID of case clicked
   */
  function infoClicked(uid) {
    if (display != "notDefined") {
      display = "notDefined";
    } else {
      display = uid;
    }
  }

  /** Dispatch an event to display map **/
  function showMapDrawing() {
    dispatch("displayMap");
  }

  /** Converts date object to dd.mm.yyyy **/
  function convertDate(date) {
    var newDate = new Date(date),
      mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
      day = ("0" + newDate.getDate()).slice(-2);
    return [day, mnth, newDate.getFullYear()].join(".");
  }
</script>

<style>
  /* Frames */
  case {
    background: #ffffff;
    border-radius: 4px;
    width: 31vh;
    height: fit-content;
    margin-left: 1vh;
    margin-right: 1vh;
    margin-bottom: 2vh;
  }
  case:hover {
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  firstHalfCaseWindow {
    display: flex;
    flex-direction: row;
    margin-top: 1vh;
  }
  nameAndAddress {
    display: flex;
    flex-direction: column;
    margin-left: 3vh;
    margin-top: 13px;
  }
  expandedCaseWindow {
    display: flex;
    flex-direction: column;
    margin-left: 9vh;
    margin-top: 2vh;
    margin-bottom: 2vh;
  }

  /* Text */
  upperCaseText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.2vh;
    line-height: 1.5vh;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: #c4c4c4;
    margin-top: 1vh;
    margin-bottom: 0.8vh;
  }
  descriptionText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.4vh;
    line-height: 1.7vh;
    color: #004245;
  }
  nameText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.6vh;
    line-height: 1.9vh;
    color: #004245;
    line-height: 2vh;
  }
  editedDate {
    margin-top: 1vh;
  }
  addressText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.5vh;
    line-height: 1.8vh;
    color: #808080;
  }
  dateText {
    font-style: normal;
    font-weight: 300;
    font-size: 1.3vh;
    line-height: 1.7vh;
    color: #60d0cb;
    margin-top: 2vh;
  }
  dateText.date {
    margin-left: 4px;
  }

  /* images */
  img.caseInfo:hover {
    background-color: rgb(21, 114, 119);
  }

  img.caseInfo {
    height: 2.5vh;
    background-color: rgb(196, 196, 196, 1);
  }
  img.caseImage {
    height: 4vh;
    margin-left: 2vh;
    margin-top: 13px;
  }
  img.smallMapImage {
    width: 12vh;
    cursor: pointer;
  }

  /* Buttons */
  button.caseInfo {
    border: none;
    background: transparent;
    margin-left: 2vh;
    margin-right: 2vh;
    height: fit-content;
  }

  button.caseInfo:active {
    background: transparent;
  }
</style>

<case class="standardCaseWindow">
  <firstHalfCaseWindow>
    {#each optionIcons as options}
      {#if options.id === reportedCase.property_details}
        <img class="caseImage" src={options.src} alt={options.src} />
      {/if}
    {/each}
    <nameAndAddress>
      <nameText>
        {auth.currentUser.displayName}
        <nameText>
          <br />
          <addressText>{reportedCase.address}</addressText>
          <br />
          <editedDate>
            {#if reportedCase.status == 'SUBMITTED'}
              <dateText>Lagt til:</dateText>
              <dateText class="date">{convertDate(reportedCase.date)}</dateText>
            {:else if reportedCase.status == 'CLOSED'}
              <dateText>Ferdig:</dateText>
              <dateText class="date">
                {convertDate(reportedCase.closed)}
              </dateText>
            {:else}
              <dateText>Sist endret:</dateText>
              <dateText class="date">
                {convertDate(reportedCase.last_updated)}
              </dateText>
            {/if}

          </editedDate>

        </nameText>
      </nameText>
    </nameAndAddress>
    <button class="caseInfo" on:click={() => infoClicked(caseID)}>
      <img
        id="caseImg"
        class="caseInfo"
        src={caseInfoSource}
        alt={'info icon'} />
    </button>
  </firstHalfCaseWindow>

  <expandedCaseWindow>
    {#if display == caseID}
      <upperCaseText>Innmeldt feil</upperCaseText>
      <descriptionText>{reportedCase.property_details}</descriptionText>
      <upperCaseText>Markering i kart</upperCaseText>
      <img
        class="smallMapImage"
        src={smallMapSource}
        alt={reportedCase.property_details}
        on:click={showMapDrawing} />
      <upperCaseText>Din kommentar</upperCaseText>
      <descriptionText>{reportedCase.comment}</descriptionText>
      {#if reportedCase.comment_caseholder}
        <upperCaseText>Kommentar fra saksbehandler</upperCaseText>
        <descriptionText>{reportedCase.comment_caseholder}</descriptionText>
      {/if}
    {/if}
  </expandedCaseWindow>
</case>
