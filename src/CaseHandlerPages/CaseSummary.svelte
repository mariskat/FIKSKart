<script>
  /** file CaseSummary.svelte
   *  Page for inspecting the details of closed cases
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import Header from "./Header.svelte";
  import EditMap from "./EditMap.svelte";
  import { CID } from "../store.js";
  import { db } from "../firebase.js";
  import { Link, navigate } from "svelte-routing";

  export let letAnimationShow = false;

  let mailIconSource = "./images/mail_icon.png";
  let darkUserSource = "./images/user_dark.png";
  let buildingSource = "./images/Bygg.png";
  let infoSource = "./images/info.png";
  let leftArrowSource = "./images/leftArrow.png";

  let promise = null;
  let username = null;
  let email = null;

  let infoTip = [false, false, false, false]; // Flags for toggling info-boxes

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
  .help-box {
    width: 251px;
  }

  img.backArrow {
    height: 2vh;
    margin-right: 4vh;
    width: auto;
  }

  mainContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    justify-content: center;
  }
  mainFrame {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    width: 74vh;
    background: #ffffff;
    box-sizing: border-box;
    height: 59vh;
    z-index: 5;
    position: relative;
    margin-bottom: 3vh;
  }

  summaryContent {
    display: flex;
    flex-direction: column;
    padding: 7%;
  }

  titleFrame {
    display: flex;
    flex-direction: row;
    margin-bottom: 5vh;
    margin-top: 8vh;
    align-items: center;
    height: 2vh;
  }
  mapWrapper {
    height: 26vh;
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
  img {
    width: 19px;
  }

  horizontalContent {
    margin: 1vh 1vh 1vh 0vh;
  }

  /* Text */
  smallCapsText {
    padding-top: 3vh;
  }
</style>

<Header />

<mainContent>
  <centerContent>

    <titleFrame>
      <title>Oversikt over avsluttet sak</title>
      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Her kan du se informasjon om hva som er sendt inn av endringer i
            kartet, og kontaktinformasjon til kunde som rapporterte om feil.
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>
    <mainFrame>
      {#if !promise}
        <p>loading..</p>
      {:else}
        <summaryContent>
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
          <mapWrapper>
            <EditMap
              {letAnimationShow}
              polygonCoordinates={promise.polygon}
              status={promise.status} />
          </mapWrapper>
          <smallCapstext>Dato sendt inn</smallCapstext>
          <horizontalContent>
            <smallNormalText>{convertDate(promise.date)}</smallNormalText>
          </horizontalContent>
          <smallCapstext>Dato avsluttet</smallCapstext>
          <horizontalContent>
            <smallNormalText>{convertDate(promise.closed)}</smallNormalText>
          </horizontalContent>
          <smallCapstext>Kommentar fra innsender</smallCapstext>
          <horizontalContent>
            <smallNormalText>{promise.comment}</smallNormalText>
          </horizontalContent>
          <smallCapstext>Kommentar fra saksbehandler</smallCapstext>
          <horizontalContent>
            <smallNormalText>{promise.comment_caseholder}</smallNormalText>
          </horizontalContent>
          <smallCapstext>Saks-ID</smallCapstext>
          <horizontalContent>
            <smallNormalText>{$CID}</smallNormalText>
          </horizontalContent>
          <smallCapstext>Saksbehandler</smallCapstext>
          <horizontalContent>
            <smallNormalText>{promise.case_handler}</smallNormalText>
          </horizontalContent>
        </summaryContent>
      {/if}
    </mainFrame>
    <nav>
      <Link to="saksoversikt">
        <button class="backButton">
          <backButtonText>
            <img class="backArrow" src={leftArrowSource} alt="back arrow" />
            <smallBoldText>Tilbake</smallBoldText>
          </backButtonText>
        </button>
      </Link>
    </nav>
  </centerContent>
</mainContent>
