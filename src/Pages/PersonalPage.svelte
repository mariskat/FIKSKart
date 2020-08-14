<script>
  /** file PersonalPage.svelte
   *  Page showing users email and name (contact-information)
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { Link } from "svelte-routing";
  import Header from "../Header/Header.svelte";
  import { isLoggedIn, user } from "../store.js";

  let mailIconSource = "./images/mail_icon.png";
  let darkUserSource = "./images/user_dark.png";
  let infoSource = "./images/info.png";
  let horizontalBarSource = "./images/horizontalProgressbar.png";

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
</script>

<style>
  /* Text */
  smallNormalText {
    padding-left: 5%;
    width: 20vw;
  }

  /* Frames */
  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 4vh;
    margin-top: 13vh;
    width: max-content;
    height: 2vh;
  }
  centerContent {
    display: flex;
    flex-direction: column;
    padding-left: 40%;
  }
  horizontalContent {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 2%;
  }
  .help-box {
    width: 29vh;
  }

  /* Images */
  img.user_dark {
    width: 25px;
    height: 25px;
  }
  img.mail_icon {
    width: 22px;
    height: 15px;
  }
</style>

<main>
  <Header />
  <centerContent>
    <titleFrame>
      <title>Min kontaktinformasjon</title>
      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Vi benytter kontaktinformasjonen for å gi deg tilbakemelding på dine
            saker.
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>
    <personalInfo>
      <horizontalContent>
        <img class={'user_dark'} src={darkUserSource} alt="user icon" />
        <smallNormalText class="name">{$user.displayName}</smallNormalText>
      </horizontalContent>

      <horizontalContent>
        <img class={'mail_icon'} src={mailIconSource} alt="mail icon" />
        <smallNormalText class="email">{$user.email}</smallNormalText>
      </horizontalContent>

    </personalInfo>
  </centerContent>
</main>
