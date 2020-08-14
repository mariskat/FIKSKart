<script>
  import { navigate } from "svelte-routing";
  import { createEventDispatcher } from "svelte";
  import { db } from "../firebase.js";

  const dispatch = createEventDispatcher();

  export let caseData;
  export let caseID;
  export let commentCaseholder;

  function handleSubmit() {
    // Updates case status to closed and saving changes
    db.ref("/map-error/" + caseID).update({
      status: "CLOSED",
      comment_caseholder: commentCaseholder,
      closed: new Date().toString()
    });
    /*postData().then(data => {
      //Suksessfull
    });*/
    navigate("/saksoversikt", { replace: true });
  }

  /** Post closed case to NGIS-OpenAPI - NOT YET DONE **/
  async function postData() {
    let datasetID = "1eb5a249-c7c5-4328-9a7f-9c6d1ce6d526";
    const response = await fetch(
      "https://qmsrest.westeurope.cloudapp.azure.com:8080/v1/datasets/" +
        datasetUID,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + API_KEY
        }
      }
    );
    return response.json();
  }

  /** Dispatch an event to close send in warning **/
  function closeSendInWarning() {
    dispatch("displaySendIn");
  }
</script>

<style>
  .sendConfirmation {
    position: absolute;
    width: 319px;
    height: 16vh;
    top: 80vh;
    left: 101.6vh;
    background: #6d6d6d;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  textWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 40px;
    margin-right: 40px;
  }
  /* Buttons */
  button.continue {
    background: #6d6d6d;
    border: none;
    color: white;
  }
  button.cancel {
    background: #6d6d6d;
    border-right: 2px solid #c4c4c4;
    border-top: none;
    border-bottom: none;
    border-left: none;
    border-radius: 0px !important;
    color: white;
  }

  button.cancel:hover,
  button.continue:hover {
    color: #b2efec;
  }

  button.closeConfirmation {
    background: transparent;
    border: none;
    width: 13.8px;
    height: 13.9px;
    position: absolute;
    left: 0;
  }
  button.closeConfirmation {
    background: transparent;
    border: none;
    width: 13.8px;
    height: 13.9px;
    position: absolute;
    left: 0;
  }

  div.confirmationButtons {
    margin: 1em;
  }

  smallBoldText.confirmation {
    color: white;
    margin-top: 4vh;
    margin-left: 3vh;
  }

  smallBoldtext.continue {
    margin-left: 1vh;
  }

  smallBoldText.cancel {
    margin-right: 3vh;
  }
  /* Images */
  img.closeConfirmation {
    width: 13.8px;
    height: 13.9px;
  }
  img.closeConfirmation {
    width: 13.8px;
    height: 13.9px;
  }
</style>

<div class="sendConfirmation">
  <button class="closeConfirmation" on:click={closeSendInWarning}>
    <img
      class="closeConfirmation"
      src="./images/closeConfirmation.png"
      alt="close" />
  </button>
  <textWrapper>
    <smallBoldText class="confirmation">
      Godkjenner du at disse saksopplysningene blir registrert i APIet?
    </smallBoldText>
  </textWrapper>
  <div class="confirmationButtons">
    <button class="cancel">
      <smallBoldText class="cancel" on:click={closeSendInWarning}>
        Avvis
      </smallBoldText>
    </button>
    <button class="continue" on:click={handleSubmit}>
      <smallBoldText class="continue">Godkjenn</smallBoldText>
    </button>
  </div>
</div>
