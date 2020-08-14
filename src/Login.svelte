<script>
  /** file Login.svelte
   *  Log in functionality and input fields for user
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import {
    db,
    login as loginFirebase,
    logInAnonymous as anonymousFirebase
  } from "./Firebase.js";
  import { navigate } from "svelte-routing";
  import { role } from "./store.js";

  let rightArrowSrc = "./images/rightArrow.png";

  let username;
  let password;
  let errorMessage;
  let isError = false;
  let isDisabled = true;
  let anonymousPressed = false;
  let infoTip = [false]; // Flag for toggling info-box

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

  /** Checks validity of input fields **/
  function checkValidity() {
    var inpObj = document.getElementById("form");
    if (!inpObj.checkValidity()) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  /** Handles login and gets the role of user then navigates to right place **/
  function login() {
    loginFirebase(username, password)
      .then(data => {
        return getRole(data.user);
      })
      .catch(error => {
        console.log("noe skjedde");
        isError = true;
      })
      .then(dataRole => {
        if (dataRole === "user") {
          role.set(dataRole);
          navigate("/kategori", { replace: true });
          isDisabled = false;
        } else if (dataRole === "case_handler") {
          role.set(dataRole);
          navigate("/saksoversikt", { replace: true });
          isDisabled = false;
        }
      });
  }

  function getRole(user) {
    let role = db
      .ref("/users/" + user.uid)
      .once("value")
      .then(function(snapshot) {
        return snapshot.val().role;
      });
    user.updateProfile({
      role: role
    });
    return role;
  }

  function logInAnonymous() {
    anonymousFirebase()
      .then(function() {
        navigate("/kategori", { replace: true });
      })
      .catch(function(error) {
        // Error handling
      });
  }

  /** Show help-box explaining anonymous-log in consequences **/
  function toggleConfirmativeHelpbox() {
    anonymousPressed = !anonymousPressed;
  }

  function continueAnonymousLogin() {
    toggleConfirmativeHelpbox();
    logInAnonymous();
  }
</script>

<style>
  /* Input */
  input.userNameInput {
    margin-top: 2vh;
    width: 316px;
  }
  input.passwordInput {
    width: 316px;
  }

  /* Buttons */
  button.anonymousSignIn {
    text-decoration-line: underline;
    background: #f9f8f8;
    border: none;
    width: fit-content;
    margin-top: 3vh;
    height: fit-content;
    margin-bottom: 0vh;
  }
  button.nextButton {
    margin-top: 2vh;
  }
  .confirmationButtons {
    display: flex;
    flex-direction: row;
    position: absolute;
    bottom: 6px;
  }
  button.continueAnonymousLogin {
    background: #6d6d6d;
    border: none;
  }
  button.cancelAnonymousLogin {
    background: #6d6d6d;
    border-right: 2px solid #c4c4c4;
    border-top: none;
    border-bottom: none;
    border-left: none;
    border-radius: 0px !important;
  }
  button.closeConfirmation {
    background: transparent;
    border: none;
    width: 13.8px;
    height: 13.9px;
    position: absolute;
    left: 0;
  }
  /* Lines */
  lines.logInLine {
    flex-grow: 1;
    height: 0px;
    margin-left: 14px;
  }

  lines.lowerLine {
    flex-grow: 1;
    height: 0px;
    margin-top: 2vh;
    margin-right: 17vh;
    width: 316px;
  }

  /* Text */
  logInText {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 316px;
  }
  smallBoldText.confirmation {
    color: white;
    margin-top: 4vh;
  }
  smallBoldText.continue {
    color: #b2efec;
  }
  smallBoldText.cancel {
    color: #c4c4c4;
    margin-right: 10px;
  }

  smallBoldText.confirmation {
    color: white;
    margin-top: 4vh;
  }
  smallBoldText.continue {
    color: #b2efec;
  }
  smallBoldText.cancel {
    color: #c4c4c4;
    margin-right: 10px;
  }

  smallBoldText.cancel:hover,
  smallBoldText.continue:hover {
    color: #b2efec;
  }

  smallBoldText.error-login {
    margin: 1em 0 0 0.8em;
    color: #f4624e;
  }

  /* Frames */
  logIn {
    display: flex;
    flex-direction: column;
    margin-top: 7vh;
  }

  form {
    display: flex;
    flex-direction: column;
    align-content: center;
  }

  infoRegisterUser {
    display: flex;
    flex-direction: row;
    width: 800px;
    height: 5.5vh;
  }

  textWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 40px;
    margin-right: 40px;
  }

  .anonymousConfirmation {
    position: absolute;
    width: 319px;
    height: 16vh;
    top: 80vh;
    background: #6d6d6d;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input.error {
    border-color: #f4624e;
  }

  /* Img */
  img.rightArrow {
    margin-left: 8vh;
  }

  img.closeConfirmation {
    width: 13.8px;
    height: 13.9px;
  }
  img.closeConfirmation {
    width: 13.8px;
    height: 13.9px;
  }
</style>

<logIn>
  <logInText>
    <smallCapsText class="logIn">Logg inn</smallCapsText>
    <lines class="logInLine" />
  </logInText>

  <form
    id="form"
    on:change|preventDefault={checkValidity}
    on:submit|preventDefault={login}>
    <input
      on:input|preventDefault={checkValidity}
      class="userNameInput"
      bind:value={username}
      placeholder="Brukernavn/e-postadresse"
      class:error={isError}
      required />
    <input
      on:input|preventDefault={checkValidity}
      class="passwordInput"
      bind:value={password}
      placeholder="Passord"
      type="password"
      class:error={isError}
      required />

    {#if isError}
      <smallBoldText class="error-login">Feil brukernavn/passord</smallBoldText>
    {/if}
    <button class="nextButton" on:click={login} class:error={isDisabled}>
      <nextButtonText>
        <smallBoldText>Logg inn</smallBoldText>
        <img class="rightArrow" src={rightArrowSrc} alt="Next arrow icon" />
      </nextButtonText>
    </button>
  </form>
  <lines class="lowerLine" />
  <infoRegisterUser>
    <button
      class="anonymousSignIn"
      on:click={toggleConfirmativeHelpbox}
      on:mousemove={() => showHelpBox(0)}
      on:mouseout={() => hideHelpBox(0)}>
      <smallCapsText>Eller fortsett som anonym bruker</smallCapsText>
    </button>
    <div class="help-box">
      {#if infoTip[0]}
        <smallNormalText class="submit-text">
          Om du fortsetter som anonym bruker
          <br />
          vil du ikke få tilbakemeldinger av oss
        </smallNormalText>
      {/if}
    </div>
  </infoRegisterUser>
  {#if anonymousPressed}
    <div class="anonymousConfirmation">
      <button class="closeConfirmation" on:click={toggleConfirmativeHelpbox}>
        <img
          class="closeConfirmation"
          src="./images/closeConfirmation.png"
          alt="close" />
      </button>
      <textWrapper>
        <smallBoldText class="confirmation">
          Om du fortsetter som anonym bruker vil du ikke få tilbakemeldinger av
          oss.
        </smallBoldText>
      </textWrapper>
      <div class="confirmationButtons">
        <button
          class="cancelAnonymousLogin"
          on:click={toggleConfirmativeHelpbox}>
          <smallBoldText class="cancel">Avvis</smallBoldText>
        </button>
        <button
          class="continueAnonymousLogin"
          on:click={continueAnonymousLogin}>
          <smallBoldText class="continue">Fortsett som anonym</smallBoldText>
        </button>
      </div>

    </div>
  {/if}
</logIn>
