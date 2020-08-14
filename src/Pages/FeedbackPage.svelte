<script>
  /** file FeedbackPage.svelte
   *  Feedback page for user, the last page shown in case-reporting.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { Link } from "svelte-routing";
  import Header from "../Header/Header.svelte";
  import { user, isLoggedIn } from "../store.js";
  import ProgressBar from "./ProgressBar.svelte";

  let infoSource = "./images/info.png";
  let horizontalBarSource = "./images/horizontalProgressbar.png";
  let feedbackGraphicSource = "./images/saksbehandling.png";
  let progressBarSource = "./images/horizontalProgressbar.png";

  let infoTip = [false]; // Flag for toggling info-boxes

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
</script>

<style>
  /* Texts */
  smallCapsText {
    margin-top: 23vh;
    margin-bottom: 3vh;
  }
  smallBoldText {
    font-size: 2.2vh;
    line-height: 2.5vh;
  }

  /*Frames */
  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4vh;
    margin-top: 13vh;
    width: max-content;
    height: 2vh;
  }
  mainContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }
  centerContent {
    display: flex;
    flex-direction: column;
    width: 500px;
    position: relative;
    z-index: 5;
  }
  centerContentOuter {
    display: flex;
    flex-direction: column;
    margin-left: 14%;
  }
  .help-box {
    width: 500px;
  }

  /* Images */
  img.saksbehandling {
    height: 50vh;
    object-fit: scale-down;
    position: absolute;
    bottom: 29%;
    left: 59vw;
  }
</style>

<main>
  <Header />

  <mainContent>
    <verticalBar>
      <ProgressBar feedbackPage={true} />

    </verticalBar>
    <centerContentOuter>
      <centerContent>

        <titleFrame>
          <title>Saksbehandling</title>

          <button
            class="info"
            on:mousemove={() => showHelpBox(0)}
            on:mouseout={() => hideHelpBox(0)}>
            <img class="info" src={infoSource} alt="" />
          </button>
          <div class="help-box">
            {#if infoTip[0]}
              <smallNormalText class="submit-text">
                Vi gir deg beskjed via mail ved fremgang i prosessen. Du kan
                også følge prosessen ved å logge inn på FIKSkart.no
              </smallNormalText>
            {/if}
          </div>

        </titleFrame>
        {#if $isLoggedIn && !$user.isAnonymous}
          <smallBoldText>
            Tusen takk for at du melder inn feil i kartet!
            <br />
            Vi har mottatt din informasjon og gir deg beskjed så snart saken er
            tatt til behandling i din kommune. Vi holder deg selvfølgelig
            oppdatert under hele prosessen.
          </smallBoldText>
        {:else}
          <smallBoldText>
            Tusen takk for at du melder inn feil i kartet!
          </smallBoldText>
        {/if}

        {#if $isLoggedIn && !$user.isAnonymous}
          <smallCapsText>
            Slik vil prosessen for din saksbehandling se ut:
          </smallCapsText>
        {/if}

      </centerContent>
      {#if $isLoggedIn && !$user.isAnonymous}
        <img class="progressBar" src={progressBarSource} alt="" />
        <!-- <FeedbackProgressbar />-->
      {/if}
    </centerContentOuter>
    <img class="saksbehandling" src={feedbackGraphicSource} alt="" />
  </mainContent>

</main>
