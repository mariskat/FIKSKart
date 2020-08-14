<script>
  /** file Summary.svelte
   *  Page showing summary of reported information
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { Link, navigate } from "svelte-routing";
  import Header from "../Header/Header.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import MapSummary from "./MapSummary.svelte";
  import { auth, writeNewMapError } from "../firebase.js";
  import {
    isLoggedIn,
    user,
    comment,
    storeCategory,
    polygons,
    isFeedbackPageDisabled,
    addressToFirebase
  } from "../store.js";

  const attachments = ["Endre bygg i kart.png"];
  let mailIconSource = "./images/mail_icon.png";
  let darkUserSource = "./images/user_dark.png";
  let buildingSource = "./images/Bygg.png";
  let leftArrowSource = "./images/leftArrow.png";
  let rightArrowSource = "./images/rightArrow.png";
  let infoSource = "./images/info.png";
  let letterSource = "./images/letter.png";

  let isAccepted = false;
  let isSubmitHelp = false;
  let infoTip = [false, false]; // Flags for toggling info-boxes

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

  /** Sends accepted information to Firebase **/
  function handleSubmit() {
    writeNewMapError(
      auth.currentUser.uid,
      $polygons,
      $storeCategory,
      $addressToFirebase,
      $comment
    ).then(navigate("/saksbehandling", { replace: true }));

    isFeedbackPageDisabled.update(n => (n = false));
  }

  /** Displays helptext when info not accepted pressed **/
  function helpSubmitText() {
    isSubmitHelp = true;
  }
</script>

<style>
  /* Accept */
  #_checkbox {
    display: none;
  }
  label {
    width: 23px;
    height: 23px;
    margin: 6px 0 0 5%;
    background-color: #f4624e;
    transform: translateY(-54%);
    border-radius: 50%;
    cursor: pointer;
    transition: 0.2s ease transform, 0.2s ease background-color,
      0.2s ease box-shadow;
    overflow: hidden;
    z-index: 1;
  }
  label:before {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    left: 0%;
    width: 14.9px;
    height: 14.5px;
    margin-left: 3.9px;
    background-color: #fff;
    transform: translateY(-50%);
    border-radius: 50%;
    transition: 0.2s ease width, 0.2s ease height;
  }
  label:hover:before {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    box-shadow: inset 0 4px 4px #ff9d96;
  }
  label:active {
    transform: translateY(-50%) scale(0.9);
  }
  #tick_mark {
    position: absolute;
    top: 10px;
    right: 6px;
    left: -6px;
    width: 15px;
    height: 3px;
    margin: 0 auto;
    margin-left: 14px;
    transform: rotateZ(-46deg);
  }
  #tick_mark:before,
  #tick_mark:after {
    content: "";
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    opacity: 0;
    transition: 0.2s ease transform, 0.2s ease opacity;
  }
  #tick_mark:before {
    left: 0;
    bottom: 0;
    width: 3px;
    height: 10px;
    transform: translateY(-68px);
  }
  #tick_mark:after {
    left: 0;
    bottom: 0;
    width: 80%;
    height: 3px;
    transform: translateX(78px);
  }
  #_checkbox:checked + label {
    background-color: #60d0cb;
  }
  #_checkbox:checked + label:before {
    width: 0;
    height: 0;
  }
  #_checkbox:checked + label #tick_mark:before,
  #_checkbox:checked + label #tick_mark:after {
    transform: translate(0);
    opacity: 1;
  }

  /* Frames */
  infoBox {
    width: 218px;
    position: absolute;
    bottom: 74px;
    right: 29px;
    z-index: 20;
    display: inline-flex;
  }
  acceptContent {
    display: flex;
    justify-content: space-around;
  }
  centerContent {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20%;
  }
  horizontalContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 2%;
  }
  mainContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;
  }
  mainFrame {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    width: 641px;
    background: #ffffff;
    box-sizing: border-box;
    height: 49vh;
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
  centerTitle {
    display: flex;
    flex-direction: column;
    margin-bottom: 17vh;
  }
  mapWrapper {
    height: 26vh;
  }
  .help-box {
    width: 300px;
  }

  /* Text */
  .accept-text {
    color: #f4624e;
    font-size: 15px;
    font-weight: bold;
    margin: -0.4em 8em 0 0;
    padding: 0;
    white-space: nowrap;
  }
  .accepted {
    color: #60d0cb;
  }
  .comment {
    margin-bottom: 3em;
  }
  smallCapsText {
    padding-bottom: 2vh;
    padding-top: 2vh;
  }
  smallNormalText {
    padding-left: 5%;
  }
  smallBoldText.address {
    padding-left: 5%;
  }
  .attachments {
    text-decoration: underline;
    cursor: pointer;
  }

  /* Images */
  img.user_dark {
    height: 25px;
    width: 25px;
  }
  img.mail_icon {
    height: 15px;
    width: 22px;
  }
  img.building {
    height: 24px;
    width: 24px;
  }

  img.paperplane {
    height: 35.93px;
    margin-left: 3vh;
    transform: rotate(11.3deg);
    width: 76.31px;
  }
  img.rightArrow {
    margin-left: 8vh;
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

  /* Buttons */
  navigationButtons {
    width: fit-content;
    height: max-content;
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>

<infoBox>
  {#if infoTip[1] && !isAccepted}
    <smallNormalText class="submit-text">
      Scroll nedover på dokumentet for å godkjenne at du har lest igjennom
      oversikten.
    </smallNormalText>
  {/if}

</infoBox>
<main>
  <Header />
  <mainContent>

    <verticalBar>
      <ProgressBar summary={true} />
    </verticalBar>

    <centerContent>
      <centerTitle>
        <titleFrame>
          <title>Oversikt innmeldt feil</title>
          <button
            class="info"
            on:mousemove={() => showHelpBox(0)}
            on:mouseout={() => hideHelpBox(0)}>
            <img class="info" src={infoSource} alt="info icon" />
          </button>
          {#if !infoTip[0]}
            <img class="paperplane" src={letterSource} alt="letter icon" />
          {/if}
          <div class="help-box">
            {#if infoTip[0]}
              <smallNormalText class="submit-text">
                Se at alt informasjonen du har oppgitt stemmer. Gå tilbake og
                rett opp i feil dersom det skulle være noen
              </smallNormalText>
            {/if}
          </div>

        </titleFrame>

        <mainFrame>
          <summaryContent>
            <smallCapstext>Personlige opplysninger</smallCapstext>
            {#if $isLoggedIn && !auth.currentUser.isAnonymous}
              <horizontalContent>
                <img class={'user_dark'} src={darkUserSource} alt="user icon" />
                <smallNormalText class="name">
                  {auth.currentUser.displayName}
                </smallNormalText>
              </horizontalContent>
              <horizontalContent>
                <img class={'mail_icon'} src={mailIconSource} alt="mail icon" />
                <smallNormalText class="email">
                  {auth.currentUser.email}
                </smallNormalText>
              </horizontalContent>
            {:else}
              <horizontalContent>
                <img class={'user_dark'} src={darkUserSource} alt="user icon" />
                <smallNormalText class="name">Anonym</smallNormalText>
              </horizontalContent>
            {/if}

            <smallCapstext>Eiendomsopplysninger</smallCapstext>
            {#if $addressToFirebase !== null}
              <horizontalContent>
                <img
                  class={'building'}
                  src={buildingSource}
                  alt="building icon" />
                <smallBoldText class="address">
                  {$addressToFirebase}
                </smallBoldText>
              </horizontalContent>
            {:else}
              <horizontalContent>
                <img
                  class={'building'}
                  src={buildingSource}
                  alt="building icon" />
                <smallBoldText class="address">
                  Ingen adresse valgt.
                </smallBoldText>
              </horizontalContent>
            {/if}

            <smallCapstext>Innmeldt feil</smallCapstext>
            <smallBoldText class="CategoryAndSpecification">
              {$storeCategory}
            </smallBoldText>

            <smallCapstext>Markering i kart</smallCapstext>
            <mapWrapper>
              <MapSummary />
            </mapWrapper>
            <smallCapstext>Vedlegg</smallCapstext>
            {#each attachments as attachment}
              <smallBoldText class="attachments">{attachment}</smallBoldText>
              <br />
            {/each}

            <smallCapstext>Kommentar</smallCapstext>
            <smallBoldText class="comment">{$comment}</smallBoldText>
          </summaryContent>
          <acceptContent>
            <input
              type="checkbox"
              id="_checkbox"
              class="accept-info"
              bind:checked={isAccepted} />
            <label for="_checkbox">
              <div id="tick_mark" />
            </label>
            <smallNormalText class="accept-text" class:accepted={isAccepted}>
              Jeg godkjenner at informasjonen jeg har oppgitt stemmer.
            </smallNormalText>
          </acceptContent>
        </mainFrame>

        <navigationButtons>
          <nav>
            <Link to="kart">
              <button class="backButton">
                <backButtonText>
                  <img
                    class="backArrow"
                    src={leftArrowSource}
                    alt="back arrow" />
                  <smallBoldText class="button">Tilbake</smallBoldText>
                </backButtonText>
              </button>
            </Link>
          </nav>

          <div
            on:mousemove={() => showHelpBox(1)}
            on:mouseout={() => hideHelpBox(1)}>

            <button
              class="nextButton"
              class:error={!isAccepted}
              disabled={!isAccepted}
              on:click={handleSubmit}>
              <nextButtonText>
                <smallBoldText class="button">Send inn</smallBoldText>
                <img
                  class="rightArrow"
                  src={rightArrowSource}
                  alt="right arrow" />
              </nextButtonText>
            </button>
          </div>
        </navigationButtons>
      </centerTitle>
    </centerContent>
  </mainContent>

</main>
