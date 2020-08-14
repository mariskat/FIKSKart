<script>
  /** file Register.svelte
   *  Register user page containing a form.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import Header from "../Header/Header.svelte";
  import * as animateScroll from "svelte-scrollto";
  import {
    signUp as signUpFirebase,
    writeUserData as writeUserDataFirebase
  } from "../firebase.js";
  import { Link, navigate } from "svelte-routing";

  let leftArrowSource = "./images/leftArrow.png";
  let infoSource = "./images/info.png";
  let rightArrowSource = "./images/rightArrow.png";

  let firstName;
  let lastName;
  let telephone;
  let email;
  let password;
  let passwordAgain;
  let role = "user";
  let isDisabled = true;
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

  /** Checks if form is valid, so that button changes
   */
  function checkValidity() {
    var inpObj = document.getElementById("form");
    if (!inpObj.checkValidity()) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  /** Signs in user  and register the user to firebase. **/
  function signUp() {
    signUpFirebase(email, password)
      .then(data => {
        data.user
          .updateProfile({
            displayName: firstName + " " + lastName
          })
          .then(
            function() {
              navigate("/kategori");
              // Update successful.
            },
            function(error) {
              // An error happened.
            }
          );
        writeUserDataFirebase(
          data.user.uid,
          firstName,
          lastName,
          email,
          telephone,
          role
        );
      })
      .catch(error => {
        // Error handling
      });
  }
</script>

<style>
  /* Lines */
  lines.userLine {
    width: 132px;
    height: 0px;
  }

  lines.loginLine {
    width: 189px;
    height: 0px;
  }

  /* Input fields */
  .userEmailInput {
    margin-top: 2vh;
  }

  input.userFirstName {
    width: 50%;
  }

  input.userLastName {
    width: 50%;
  }

  /* Buttons */
  button.backButton {
    position: absolute;
    bottom: 10px;
  }

  button.nextButton {
    margin-top: 3vh;
  }

  button.info {
    margin-top: 18px;
    margin-left: 1vh;
  }

  /* Frames */
  mainContent {
    display: flex;
    flex-direction: column;
    margin-top: 10vh;
    padding-left: 36%;
  }

  .help-box {
    width: 228px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-content: center;
    margin-top: 5vh;
    width: 353px;
  }

  personalInfoTitle {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  logInInfo {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 4vh;
  }

  personalInfo {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 3vh;
  }

  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 2vh;
  }

  /* Lines */
  lines.userLine {
    flex-grow: 1;
    height: 0px;
    margin-left: 10px;
  }

  lines.loginLine {
    flex-grow: 1;
    height: 0px;
    margin-left: 10px;
  }
</style>

<main>
  <Header />
  <mainContent>
    <titleFrame>
      <title>Opprett bruker</title>
      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="info icon" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Vi trenger opplysningene dine for å kunne oppdatere deg i
            saksbehandlingen
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>

    <form
      id="form"
      on:change|preventDefault={checkValidity}
      on:submit|preventDefault={signUp}>
      <personalInfoTitle>
        <smallCapsText>Personlige opplysninger</smallCapsText>
        <lines class="userLine" />
      </personalInfoTitle>
      <personalInfo>
        <input
          on:input|preventDefault={checkValidity}
          class="userFirstName"
          bind:value={firstName}
          placeholder="Navn"
          type="text"
          required />
        <input
          on:input|preventDefault={checkValidity}
          class="userLastName"
          bind:value={lastName}
          placeholder="Etternavn"
          type="text"
          required />
      </personalInfo>

      <input
        on:input|preventDefault={checkValidity}
        class="telephone"
        bind:value={telephone}
        placeholder="Telefonnummer"
        required />

      <logInInfo>
        <smallCapsText class="loginInfo">Innloggingsinfo</smallCapsText>
        <lines class="loginLine" />
      </logInInfo>
      <input
        on:input|preventDefault={checkValidity}
        class="userEmailInput"
        bind:value={email}
        placeholder="E-postadresse"
        required />
      <input
        on:input|preventDefault={checkValidity}
        class="passwordInput"
        bind:value={password}
        placeholder="Passord"
        type="password"
        required />
      <input
        on:input|preventDefault={checkValidity}
        class="passwordAgainInput"
        bind:value={passwordAgain}
        placeholder="Gjenta passord"
        type="password"
        required />

      <button class="nextButton" class:error={isDisabled}>
        <nextButtonText>
          <smallBoldText>Opprett bruker</smallBoldText>
          <img class="rightArrow" src={rightArrowSource} alt="next arrow" />
        </nextButtonText>
      </button>
    </form>

    <nav>
      <Link to="/">
        <button class="backButton" on:click={() => animateScroll.scrollToTop()}>
          <backButtonText>
            <img class="backArrow" src={leftArrowSource} alt="back arrow img" />
            <smallBoldText>Tilbake</smallBoldText>
          </backButtonText>
        </button>
      </Link>
    </nav>
  </mainContent>

</main>
