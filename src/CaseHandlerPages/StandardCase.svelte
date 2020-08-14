<script>
  /** file StandardCase.svelte
   *  Framework for one case to be displayed in Cases for the case holder
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { writable } from "svelte/store";
  import { Link, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { auth, db } from "../firebase.js";
  import { CID } from "../store";

  const dispatch = createEventDispatcher();

  let caseInfoSource = "./images/caseInfo.png";
  let takeCaseSource = "./images/takeCaseIcon.png";
  let rejectCaseSource = "./images/rejectIcon.png";
  let startCaseSource = "./images/startCaseIcon.png";
  let inspectCaseSource = "./images/inspectCaseIcon.png";
  let editCaseSource = "./images/editCaseIcon.png";
  let mailSource = "./images/mail_icon.png";
  let rightArrowSource = "./images/rightArrow.png";
  let sentIconSource = "./images/letter.png";
  let leftArrowSource = "./images/leftArrow.png";
  let closeCaseSource = "./images/closeAnimation.png";
  let smallMapSource = "./images/dummyMapDrawingSmall.png";

  export let caseID;
  export let reportedCase;
  let username;

  const isInfoPressed = writable(false);
  const isCaseRejected = writable(false);
  const isMessageSent = writable(false);
  let display = "notDefined";

  let optionIcons = [
    {
      id: "Bygg, Legg til bygg i kart",
      source: "./images/addBuilding.png"
    },
    {
      id: "Bygg, Fjerne bygg fra kart",
      source: "./images/demolishBuilding.png"
    },
    {
      id: "Bygg, Endre bygg i kart",
      source: "./images/changeBuilding.png"
    }
  ];

  onMount(async () => {
    let firebaseUserName;

    // Fetches the username of the reported case
    await db
      .ref("/users/" + reportedCase.user_id)
      .once("value")
      .then(function(snapshot) {
        firebaseUserName =
          (snapshot.val() && snapshot.val().name) || "Anonymous";
      });
    username = await firebaseUserName;
  });

  /** Changes the status of the case
   *  param action - rejection, starting, e.g. for case
   */
  function handleCase(action) {
    if (action == "reject") {
      isCaseRejected.set(true);
    } else if (action == "takeCase") {
      // Change status of case with UID to TAKEN and set caseHandler to the case
      var caseHandler = auth.currentUser.uid;
      db.ref("/map-error/" + caseID).update({
        case_handler: caseHandler,
        status: "TAKEN",
        last_updated: new Date().toString()
      });
    } else if (action == "startCase") {
      // Change status of case with UID to INPROCESS
      db.ref("/map-error/" + caseID).update({
        status: "INPROCESS",
        last_updated: new Date().toString()
      });
    } else if (action == "continueCase") {
      CID.update(n => (n = caseID));
      navigate("/redigere-sak", { replace: true });
    } else if (action == "inspectCase") {
      CID.update(n => (n = caseID));
      navigate("/oppsummering-sak", { replace: true });
    }
  }

  /** Converts date object to dd.mm.yyyy **/
  function convertDate(date) {
    var newDate = new Date(date),
      mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
      day = ("0" + newDate.getDate()).slice(-2);
    return [day, mnth, newDate.getFullYear()].join(".");
  }

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

  function handleRejectionSubmit() {
    // TO DO:
    // Send actual message to customer

    isMessageSent.set(true);
    setTimeout(function() {
      isCaseRejected.set(false); // Reset flag after displaying message to user
      isMessageSent.set(false); // Reset flag after displaying message to user
      db.ref("/map-error/" + caseID).update({ status: "REJECTED" });
    }, 10000);
  }
</script>

<style>
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
  secondHalfCaseWindow {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 2vh;
  }
  secondHalfCaseWindowProcess {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 1vh;
  }
  confirmCases {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  expandedCaseWindow {
    display: flex;
    flex-direction: column;
    margin-left: 9vh;
    margin-top: 2vh;
  }
  messageSection {
    width: 100%;
    height: 25vh;
  }
  secondHalfCaseWindow.rejection {
    width: 100%;
  }
  seperationLine {
    border: 1px solid #dbdbdb;
    width: 14vh;
    margin-left: 1vh;
  }

  /* Text */
  nameText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.6vh;
    line-height: 2vh;
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
    line-height: 1.9vh;
    color: #808080;
  }
  dateText {
    font-style: normal;
    font-weight: 400;
    font-size: 1.3vh;
    line-height: 1.6vh;
    color: #c4c4c4;
    margin-top: 2vh;
  }
  dateText.date {
    margin-left: 4px;
  }
  textarea {
    background: #ffffff;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    box-sizing: border-box;
    height: 15vh;
    padding: 1.5em;
    resize: none;
    width: -webkit-fill-available;
    margin: 1vh;
    margin-bottom: 0.4vh;
  }
  textarea:focus {
    outline: none !important;
    border: 1px solid #60d0cb;
    border-radius: 8px;
    box-sizing: border-box;
  }
  smallBoldText {
    font-size: 1.5vh;
  }
  caseHandlingText.messageSent {
    line-height: 1.7vh;
    margin-top: 0.7vh;
    margin-bottom: 0.7vh;
    margin-right: 5vh;
    margin-bottom: 3vh;
    margin-left: 5vh;
  }
  caseHandlingText {
    font-style: normal;
    font-weight: 500;
    font-size: 1.6vh;
    line-height: 1.9vh;
    display: flex;
    align-items: center;
    color: #004245;
    margin: 0.7vh 2vh 0.7vh 0;
  }
  rejectCaseText {
    font-style: normal;
    font-weight: 500;
    font-size: 1.6vh;
    line-height: 1.9vh;
    display: flex;
    align-items: center;
    margin: 0.7vh 2vh 0.7vh 0;
  }
  upperCaseText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.2vh;
    line-height: 1.3vh;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    color: #c4c4c4;
    margin: 1vh 0 0.8vh 0;
  }
  upperCaseText.rejection {
    color: #004245;
    font-size: 1.4vh;
    margin-left: 0.8vh;
  }
  descriptionText {
    font-style: normal;
    font-weight: normal;
    font-size: 1.4vh;
    line-height: 1.7vh;
    color: #004245;
  }
  title {
    display: flex;
    flex-direction: row;
    align-items: center;
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
  img.caseButtonIcon {
    height: 2vh;
    background: #157277;
    margin-right: 0.8vh;
    margin-left: 2vh;
  }
  img.rejectCaseIcon {
    width: 2vh;
    background: #c4c4c4;
    margin-right: 0.8vh;
    margin-left: 2vh;
  }
  img.startCase {
    background: #157277;
    height: 20px;
  }
  img.smallMapImage {
    width: 12vh;
    cursor: pointer;
  }
  img.mail {
    width: 1.6vh;
    margin-left: 1.3vh;
  }
  img.rightArrow,
  img.backArrow {
    margin-left: 1vh;
    height: 1.5vh;
    margin-top: 0.3vh;
  }
  img.sentIcon {
    width: 7vh;
  }
  img.closeCase {
    width: 2vh;
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
  button.rejectCase {
    background: transparent;
    border-right: 2px solid #c4c4c4;
    border-top: 2px solid #c4c4c4;
    border-bottom: none;
    border-left: none;
    border-radius: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 1vh;
    color: #c4c4c4;
  }
  button.takeCase {
    background: transparent;
    border-top: 2px solid #c4c4c4;
    border-bottom: none;
    border-left: none;
    border-right: none;
    border-radius: 0px;
    margin-left: -4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 1vh;
    color: #157277;
  }
  button.takeCase:hover,
  button.rejectCase:hover {
    color: #60d0cb;
  }
  button.startCase {
    font-style: normal;
    font-weight: 500;
    color: #004245;
    font-size: 1.6vh;
    border: none;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1vh;
  }
  button.startCase:hover,
  button.takeCase:hover caseHandlingText {
    color: #60d0cb;
  }
  button.takeCase:hover img.caseButtonIcon,
  button.rejectCase:hover img.rejectCaseIcon,
  button.startCase:hover img.startCase {
    background: #60d0cb;
  }
  button.closeRejectedCase {
    border: none;
    background: transparent;
    margin-left: 28vh;
    margin-top: -1.5vh;
  }
  nextButtonText {
    width: fit-content;
    padding: 0.5vh;
    padding-right: 0vh;
  }
  backButtonText {
    display: flex;
    flex-direction: row;
    align-content: center;
    width: 10vh;
    padding: 0.5vh;
    padding-left: 0vh;
  }
  rejectButtons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>

<case class="standardCaseWindow">
  {#if !$isMessageSent}
    <firstHalfCaseWindow>
      {#each optionIcons as options}
        {#if options.id === reportedCase.property_details}
          <img class="caseImage" src={options.source} alt={options.source} />
        {/if}
      {/each}
      <nameAndAddress>
        <nameText>
          {username}
          <nameText>
            <br />
            <addressText>{reportedCase.address}</addressText>
            <br />
            <editedDate>
              {#if reportedCase.status == 'SUBMITTED'}
                <dateText>Lagt til:</dateText>
                <dateText class="date">
                  {convertDate(reportedCase.date)}
                </dateText>
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
      <button
        class="caseInfo"
        on:click={() => {
          CID.update(n => (n = caseID));
          infoClicked(caseID);
        }}>
        <img
          id="caseInfo"
          class="caseInfo"
          src={caseInfoSource}
          alt={caseInfoSource} />
      </button>
    </firstHalfCaseWindow>
  {/if}

  <expandedCaseWindow>
    {#if !$isMessageSent}
      {#if display == caseID}
        <upperCaseText>Innmeldt feil</upperCaseText>
        <descriptionText>{reportedCase.property_details}</descriptionText>
        <upperCaseText>Markering i kart</upperCaseText>
        <img
          class="smallMapImage"
          src={smallMapSource}
          alt={reportedCase.property_details}
          on:click={showMapDrawing} />
        <upperCaseText>Kommentar</upperCaseText>
        <descriptionText>{reportedCase.comment}</descriptionText>
        {#if reportedCase.comment_caseholder}
          <upperCaseText>Kommentar fra saksbehandler</upperCaseText>
          <descriptionText>{reportedCase.comment_caseholder}</descriptionText>
        {/if}
      {/if}
    {/if}
  </expandedCaseWindow>

  {#if reportedCase.status === 'SUBMITTED'}
    <confirmCases>
      {#if $isCaseRejected && $isMessageSent}
        <button
          class="closeRejectedCase"
          on:click={() => {
            db.ref('/map-error/' + caseID).update({ status: 'REJECTED' });
            isCaseRejected.set(false);
            isMessageSent.set(false);
          }}>
          <img class="closeCase" src={closeCaseSource} alt={closeCaseSource} />
        </button>

        <img class="sentIcon" src={sentIconSource} alt={sentIconSource} />
        <caseHandlingText class="messageSent">
          Din tilbakemelding er sendt
        </caseHandlingText>
      {/if}

      {#if $isCaseRejected && !$isMessageSent}
        <secondHalfCaseWindow class="rejection">
          <messageSection>
            <title>
              <img class="mail" src={mailSource} alt={mailSource} />
              <upperCaseText class="rejection">Begrunnelse</upperCaseText>
              <seperationLine />
            </title>
            <textarea
              class="comments"
              placeholder="Eks: Det mangler dokumentasjon på riving av bygg..."
              required />
            <rejectButtons>
              <button
                class="backButton"
                on:click={() => isCaseRejected.set(false)}>
                <backButtonText>
                  <img
                    class="backArrow"
                    src={leftArrowSource}
                    alt="back arrow" />
                  <smallBoldText class="button">Angre</smallBoldText>
                </backButtonText>
              </button>
              <button class="nextButton" on:click={handleRejectionSubmit}>
                <nextButtonText>
                  <smallBoldText class="button">Send melding</smallBoldText>
                  <img
                    class="rightArrow"
                    src={rightArrowSource}
                    alt="right arrow" />
                </nextButtonText>
              </button>
            </rejectButtons>
          </messageSection>
        </secondHalfCaseWindow>
      {/if}
      {#if !$isCaseRejected && !$isMessageSent}
        <secondHalfCaseWindow>
          <button class="rejectCase" on:click={() => handleCase('reject')}>
            <img
              class="rejectCaseIcon"
              src={rejectCaseSource}
              alt="rejectCaseIcon" />

            <rejectCaseText>Avvis</rejectCaseText>
          </button>
          <button class="takeCase" on:click={() => handleCase('takeCase')}>
            <img class="caseButtonIcon" src={takeCaseSource} alt="case icon" />
            <caseHandlingText>Ta saken</caseHandlingText>
          </button>
        </secondHalfCaseWindow>
      {/if}
    </confirmCases>
  {:else}
    <secondHalfCaseWindowProcess>
      {#if reportedCase.status === 'TAKEN'}
        <button class="startCase" on:click={() => handleCase('startCase')}>
          <img class="startCase" src={startCaseSource} alt="start case icon" />
          Start på saken
        </button>
      {/if}

      {#if reportedCase.status === 'INPROCESS'}
        <button class="startCase" on:click={() => handleCase('continueCase')}>
          <img class="startCase" src={editCaseSource} alt="start case" />
          Fortsett behandling
        </button>
      {/if}

      {#if reportedCase.status === 'CLOSED'}
        <button class="startCase" on:click={() => handleCase('inspectCase')}>
          <img class="startCase" src={inspectCaseSource} alt="start case" />
          Se på saken
        </button>
      {/if}
    </secondHalfCaseWindowProcess>
  {/if}
</case>
