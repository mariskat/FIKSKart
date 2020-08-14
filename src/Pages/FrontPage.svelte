<script>
  /** file FrontPage.svelte
   *  Front page for user, imports login-fields
   *  Authors: Thea Tokstad and Marie Skatvedt
   */
  import { Link } from "svelte-routing";
  import { writable } from "svelte/store";
  import Map from "./Map/Map.svelte";
  import Login from "../Login.svelte";
  import Header from "../Header/Header.svelte";

  let frontpageSource = "./images/frontPhoto.png";
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
    width: 36vw;
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
  infoRegisterUser {
    display: flex;
    flex-direction: row;
    width: 600px;
    height: 0px;
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
  button.registerUser {
    text-decoration-line: underline;
    background: #f9f8f8;
    border: none;
    width: fit-content;
    margin-top: 1vh;
    height: 1vh;
    margin-bottom: 0px;
  }
</style>

<main>
  <Header />
  <titleFrameOuter>
    <title class="frontPageTitle">Oppdaget en feil i</title>
    <titleFrame>
      <title class="frontPageTitle">kartet?</title>

      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Det eksisterer mye feil i kart, og kommuner landet rundt jobber
            kontinuerlig med å holde det oppdatert. Takk for at du hjelper til i
            arbeidet!
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>

  </titleFrameOuter>

  <mainContent>
    <leftContent>

      <smallBoldText>
        Her kan du enkelt melde i fra slik at din kommune kan evaluere
        <br />
        saken og komme tilbake til deg!
      </smallBoldText>
      <Login />

      <nav>
        <Link to="/opprett-bruker">
          <button class="registerUser">
            <smallCapsText>Eller fortsett med din finn.no bruker</smallCapsText>
          </button>
        </Link>
      </nav>
      <nav>
        <Link to="/innlogging-saksbehandler">
          <button class="registerUser">
            <smallCapsText>Saksbehandler</smallCapsText>
          </button>
        </Link>
      </nav>

      <infoRegisterUser>
        <nav>
          <Link to="/opprett-bruker">
            <button
              class="registerUser"
              on:mousemove={() => showHelpBox(1)}
              on:mouseout={() => hideHelpBox(1)}>
              <smallCapsText>Eller registrer en bruker</smallCapsText>
            </button>
          </Link>
        </nav>
        <div class="help-box">
          {#if infoTip[1]}
            <smallNormalText class="submit-text">
              Vi anbefaler å registrere bruker dersom du ønsker tilbakemeldinger
              eller om vi trenger å kontakte deg
            </smallNormalText>
          {/if}
        </div>
      </infoRegisterUser>
    </leftContent>
  </mainContent>
  <img class="frontPhoto" src={frontpageSource} alt="frontpage icon" />

</main>
