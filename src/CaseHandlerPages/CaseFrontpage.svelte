<script>
  /** file CaseFrontPage.svelte
   *  Front page for case holder
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import Login from "../Login.svelte";
  import Header from "./Header.svelte";
  import { Link } from "svelte-routing";
  import { writable } from "svelte/store";

  let frontPageInternSource = "./images/saksbehandling.png";
  let infoSource = "./images/info.png";

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
</script>

<style>
  /* Frames */
  mainContent {
    display: flex;
    flex-direction: row;
    padding-left: 18%;
    padding-right: 10%;
  }
  leftContent {
    display: flex;
    flex-direction: column;
    width: 51vh;
  }
  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 12vh;
  }
  titleFrameOuter {
    display: flex;
    flex-direction: column;
    margin-top: 5vh;
    padding-left: 18%;
    padding-right: 10%;
  }
  .help-box {
    width: 300px;
  }

  /* Text */
  title.frontPageTitle {
    font-style: normal;
    font-weight: bold;
    font-size: 9vh;
    line-height: 9.5vh;
  }
  smallBoldText {
    margin-top: 2vh;
    line-height: 2.5vh;
  }

  /* Images */
  img.frontPhoto {
    position: absolute;
    object-fit: scale-down;
    height: 60vh;
    padding-bottom: 2vh;
    bottom: -2%;
    left: 47%;
  }

  /* Buttons */
  button.info {
    margin-top: 3.5vh;
  }
</style>

<main>
  <Header />
  <titleFrameOuter>
    <title class="frontPageTitle">Hei, og velkommen tilbake</title>
    <titleFrame>
      <title class="frontPageTitle">til Fikskart/intern</title>

      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Vennligst logg inn med dine saksbehandleropplysninger for å se nye
            innmeldte saker, fortsette saksbehandling i dine saker og se
            avsluttede saker.
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>

  </titleFrameOuter>

  <mainContent>
    <leftContent>

      <smallBoldText>
        Logg inn for å se og endre dine tidligere, påbegynte, og
        <br />
        avsluttede saker
      </smallBoldText>
      <Login />
    </leftContent>
  </mainContent>
  <img class="frontPhoto" src={frontPageInternSource} alt="frontpage " />

</main>
