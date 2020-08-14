<script>
  /** file EditCase.svelte
   *  Page for editing reported mapdrawings/edits in map and commenting on case
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { onMount } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { writable } from "svelte/store";
  import Header from "./Header.svelte";
  import EditMap from "./EditMap.svelte";
  import SendData from "./SendData.svelte";
  import { CID } from "../store.js";
  import { db } from "../firebase.js";

  export let letAnimationShow = true;

  let mailIconSource = "./images/mail_icon.png";
  let darkUserSource = "./images/user_dark.png";
  let buildingSource = "./images/Bygg.png";
  let leftArrowSource = "./images/leftArrow.png";
  let rightArrowSource = "./images/rightArrow.png";
  let infoSource = "./images/info.png";

  let infoTip = [false]; // Flag for toggling info-boxes

  let promise = null;
  let username = null;
  let email = null;
  let commentCaseholder = "";
  let isSendInData = writable(false);

  function closeSendDataWarning() {
    isSendInData.set(false);
  }

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

  /** Converts date object to dd.mm.yyyy **/
  function convertDate(date) {
    var newDate = new Date(date),
      mnth = ("0" + (newDate.getMonth() + 1)).slice(-2),
      day = ("0" + newDate.getDate()).slice(-2);
    return [day, mnth, newDate.getFullYear()].join(".");
  }

  /** Gets username and email to the user (uid) of the case **/
  async function getUserInformation(uid) {
    await db
      .ref("/users/" + uid)
      .once("value")
      .then(function(snapshot) {
        username = (snapshot.val() && snapshot.val().name) || "Anonymous";
        email = snapshot.val().email;
      });
  }

  /** Listen to changes in a case with CID (caseID) and updates the case **/
  db.ref("/map-error/" + $CID).on("value", snap => {
    promise = snap.val();
    getUserInformation(snap.val().user_id);
  });
</script>

<style>
  /* Frames */
  main {
    display: flex;
    flex-direction: row;
  }

  mainContent {
    display: flex;
    flex-direction: column;
    width: 80vh;
    height: 83%;
    overflow: hidden;
    margin-left: 18vh;
  }
  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8vh 0 7vh 0vh;
    height: 2vh;
  }
  horizontalContent {
    margin: 2% 0 0 2em;
  }
  verticalBar {
    width: 37vh;
    background: white;
    display: flex;
    flex-direction: row;
  }
  textarea {
    background: #ffffff;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    box-sizing: border-box;
    height: 24vh;
    padding: 1.5em;
    resize: none;
    width: initial;
  }
  textarea:focus {
    outline: none !important;
    border: 1px solid #60d0cb;
    border-radius: 8px;
    box-sizing: border-box;
  }

  /* Text */
  smallCapsText {
    margin: 3em 0 5px 2em;
    font-size: 1.8vh;
  }
  nextButtonText {
    width: 21vh;
    padding-left: 0;
  }
  .caseholderComment {
    margin-left: 1vh;
    margin-top: 0;
    width: 26vh;
  }
  subTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1vh;
  }

  /* Images */
  img.building,
  .user_dark,
  .mail_icon {
    width: 20px;
  }
  img.rightArrow-next {
    margin-left: 2vh;
  }

  /* Buttons */
  navigationButtons {
    width: fit-content;
    height: max-content;
    margin-top: 3vh;
    align-self: flex-end;
  }

  infoWrapper {
    display: flex;
    flex-direction: column;
    margin-top: 8vh;
  }

  seperationLine {
    border: 1px solid #dbdbdb;
    margin-left: 1vh;
    width: -webkit-fill-available;
  }

  subTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 1vh;
  }

  smallNormalText {
    font-size: 1.9vh;
    font-weight: 500;
  }

  .help-box smallNormalText {
    width: 21vh;
    font-style: normal !important;
  }
</style>

<Header />
<main>
  {#if !promise}
    <p>loading..</p>
  {:else}
    <verticalBar>
      <infoWrapper>
        <smallCapstext>Personlige opplysninger</smallCapstext>

        <horizontalContent>
          <img class={'user_dark'} src={darkUserSource} alt="user icon" />
          <smallNormalText class="name">
            {#if !username}
              <p>..loading</p>
            {:else}{username}{/if}
          </smallNormalText>
        </horizontalContent>
        <horizontalContent>
          <img class={'mail_icon'} src={mailIconSource} alt="mail icon" />
          <smallNormalText class="email">
            {#if !email}
              <p>..loading</p>
            {:else}{email}{/if}
          </smallNormalText>
        </horizontalContent>

        <smallCapstext>Eiendomsopplysninger</smallCapstext>
        <horizontalContent>
          <img class={'building'} src={buildingSource} alt="building icon" />
          <smallNormalText class="address">{promise.address}</smallNormalText>
        </horizontalContent>
        <smallCapstext>Innmeldt feil</smallCapstext>
        <horizontalContent>
          <smallNormalText>{promise.property_details}</smallNormalText>
        </horizontalContent>
        <smallCapstext>Dato sendt inn</smallCapstext>
        <horizontalContent>
          <smallNormalText>{convertDate(promise.date)}</smallNormalText>
        </horizontalContent>
        <smallCapstext>Kommentar</smallCapstext>
        <horizontalContent>
          <smallNormalText>{promise.comment}</smallNormalText>
        </horizontalContent>
        <smallCapstext>Saks-ID</smallCapstext>
        <horizontalContent>
          <smallNormalText>{$CID}</smallNormalText>
        </horizontalContent>
      </infoWrapper>
    </verticalBar>
    <mainContent>
      <titleFrame>
        <title>Rediger innmeldt sak</title>
        <button
          class="info"
          on:mousemove={() => showHelpBox(0)}
          on:mouseout={() => hideHelpBox(0)}>
          <img class="info" src={infoSource} alt="info icon" />
        </button>
        <div class="help-box">
          {#if infoTip[0]}
            <smallNormalText class="submit-text">
              Rediger kartdata som er meldt inn av bruker ved å tegne og endre
              på kartet.
            </smallNormalText>
          {/if}
        </div>
      </titleFrame>
      <EditMap
        {letAnimationShow}
        polygonCoordinates={promise.polygon}
        status={promise.status} />
      <br />
      <br />
      <subTitle>
        <smallCapstext class="caseholderComment">
          Kommentar til saken
        </smallCapstext>
        <seperationLine />
      </subTitle>
      <textarea
        bind:value={commentCaseholder}
        placeholder="Eks: Bygningstillatelse innvilget i 2013, endret..." />
      <navigationButtons>
        <nav>
          <Link to="saksoversikt">
            <button class="backButton">
              <backButtonText>
                <img class="backArrow" src={leftArrowSource} alt="Back arrow" />
                <smallBoldText>Tilbake</smallBoldText>
              </backButtonText>
            </button>
          </Link>
        </nav>
        {#if $isSendInData}
          <SendData
            caseID={$CID}
            caseData={promise}
            {commentCaseholder}
            on:displaySendIn={closeSendDataWarning} />
        {/if}
        <button
          class="nextButton"
          on:click={() => {
            isSendInData.set(true);
          }}>
          <nextButtonText>
            <smallBoldText>Send inn endringer</smallBoldText>
            <img
              class="rightArrow-next"
              src={rightArrowSource}
              alt="Next arrow" />
          </nextButtonText>
        </button>
      </navigationButtons>
    </mainContent>
  {/if}
</main>
