<script>
  /** file Documentation.svelte
   *  Documentation page containing drag-and-drop fileattachments and commentsection.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { fly } from "svelte/transition";
  import { Link } from "svelte-routing";
  import Dropzone from "svelte-file-dropzone";
  import { comment, storeCategory } from "../store.js";
  import { createEventDispatcher } from "svelte";

  let trashcanSource = "./images/transparentDelete.png";
  let downloadSource = "./images/grey_download.png";
  let infoSource = "./images/info.png";

  const dispatch = createEventDispatcher();
  let infoTip = [false, false, false]; // Flags for toggling info-boxes
  let files = {
    accepted: [],
    rejected: []
  };

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

  /** Handles files when drag-and-dropped
   *  param e - File that is attached
   */
  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  /** Removes attached file
   *  param e - File that is attached
   *  param index - index of file in list of attached files
   */
  function handleRemoveFile(e, index) {
    files.accepted.splice(index, 1);
    files.accepted = [...files.accepted];
  }
</script>

<style>
  /* Frames */
  .grid {
    align-items: center;
    display: flex;
  }
  .container {
    display: flex;
    white-space: nowrap;
    margin-top: 2vh;
    flex-direction: row;
    align-items: center;
  }
  titleFrame {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 2vh;
    width: max-content;
    margin-top: 2vh;
    margin-bottom: 5vh;
  }
  .documentation {
    width: 434px;
  }

  /* Lines */
  longLine {
    border: 1.1px solid #dbdbdb;
    height: 0px;
    width: 100%;
  }

  /* Dropzone */
  .dropzone {
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: 396px;
    flex-direction: column;
  }
  .drag-and-drop {
    color: #004245;
    font-size: 16px;
    font-weight: 300;
  }
  dropzoneRows {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .download-types {
    color: #acacac;
    font-size: 1.5vh;
    margin-left: 30%;
  }

  /* Attachments*/
  ol {
    display: contents;
  }
  .attachment {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  attachmentWrapper {
    height: 13vh;
    display: flex;
    flex-direction: column;
  }

  /* Input-field */
  ::placeholder {
    color: #acacac;
    font-size: 15px;
    font-weight: 300;
  }

  /* Text */
  h6 {
    color: #acacac;
    font-size: 16px;
    font-weight: 300;
    margin: -3% 1.5em;
  }
  span {
    color: #004245;
    font-weight: bold;
  }
  span.attachments-name {
    font-weight: 400;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  smallCapsText {
    margin-right: 1vh;
  }

  /* Help box */
  textarea {
    background: #ffffff;
    border: 1px solid #dbdbdb;
    border-radius: 8px;
    box-sizing: border-box;
    height: 15vh;
    padding: 1.5em;
    resize: none;
    width: 500px;
  }
  textarea:focus {
    outline: none !important;
    border: 1px solid #60d0cb;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .help-box {
    width: 300px;
    margin-left: 10px;
  }
  infoAttachement {
    display: flex;
    flex-direction: row;
    width: 700px;
    height: 13vh;
  }

  /* Buttons */
  .trashcan-button {
    border: none;
    background: #f9f8f8;
    margin-left: 37px;
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .trashcan-button:hover {
    box-shadow: none;
    border-radius: 2px;
  }

  /* Img */
  img {
    width: 18px;
  }
  img.document {
    margin-right: 4px;
    margin-top: 5px;
  }
  img.trash {
    background: #6d6d6d;
    width: 33px;
  }
  img.trash:hover {
    background: #6ad3ce;
  }
  img.download {
    left: -51px;
    position: absolute;
    top: 9px;
    width: 30px;
  }
</style>

<div class="grid">
  <div class="documentation">
    <titleFrame>
      <title>Legg ved dokumentasjon</title>
      <button
        class="info"
        on:mousemove={() => showHelpBox(0)}
        on:mouseout={() => hideHelpBox(0)}>
        <img class="info" src={infoSource} alt="" />
      </button>
      <div class="help-box">
        {#if infoTip[0]}
          <smallNormalText class="submit-text">
            Nødvendig informasjon gjør det lettere for saksbehandlere å behandle
            saken. Dersom du nå logger ut av nettstedet er informasjonen lagret
            til du logger inn igjen.
          </smallNormalText>
        {/if}
      </div>
    </titleFrame>

    <div class="container">
      <smallCapsText class="attachment-text">Legg til vedlegg</smallCapsText>
      <longLine class="attachment-line" />
    </div>
    <infoAttachement>
      <dropzoneRows>
        <Dropzone
          on:drop={handleFilesSelect}
          containerStyles={'background: #ffffff; border: 2px dashed #DBDBDB; box-sizing: border-box; border-radius: 8px; cursor: pointer;'}>

          <div
            class="dropzone"
            on:mousemove={() => showHelpBox(1)}
            on:mouseout={() => hideHelpBox(1)}>
            <img class="download" src={downloadSource} alt="download button" />
            <smallNormalText class="drag-and-drop">
              Dra og dropp filer hit eller
              <span>trykk her</span>
              <br />
              <smallCapsText class="download-types">
                jpg, png, svg, pdf
              </smallCapsText>
            </smallNormalText>
          </div>

        </Dropzone>
      </dropzoneRows>
      <div class="help-box">
        {#if infoTip[1]}
          <smallNormalText class="submit-text">
            Last opp bilder, tegninger og tinglyste dokumenter som kan
            illustrere feilen i kartet.
          </smallNormalText>
        {/if}
      </div>
    </infoAttachement>

    <h6>Eks: Bilde av bygning eller byggedokumentasjon</h6>
    <br />
    <br />
    <ol>

      <div class="container">
        <smallCapsText class="attachment-header">Vedlegg</smallCapsText>
        <longLine class="comment-line" />
      </div>

      <attachmentWrapper>
        {#each files.accepted as item, index}
          <div
            class="attachment"
            on:click={dispatch('scrollDown')}
            in:fly={{ y: -130, duration: 2000 }}>
            <span class="attachments-name">
              <img class="document" src={'./images/pdf.png'} alt="document" />
              {item.name}
            </span>
            <button
              class="trashcan-button"
              on:click={e => handleRemoveFile(e, index)}>
              <img class="trash" src={trashcanSource} alt="trashcan" />
            </button>
          </div>
        {/each}
      </attachmentWrapper>
    </ol>
    <div class="container">
      <smallCapsText>Kommentar</smallCapsText>
      <longLine class="comment-line" />
    </div>

    <br />
    <infoAttachement>
      <textarea
        on:mousemove={() => showHelpBox(2)}
        on:mouseout={() => hideHelpBox(2)}
        class="comments"
        placeholder="Eks: Bygget ble fjernet i 2019 grunnet..."
        bind:value={$comment}
        required />

      <div class="help-box">
        {#if infoTip[2]}
          <smallNormalText class="submit-text">
            Beskriv hva feilen gjelder og hvorfor du vil melde den inn.
          </smallNormalText>
        {/if}
      </div>
    </infoAttachement>
  </div>

</div>
