<script>
  /** file ProgressBar.svelte
   *  Vertical progressbar, displaying progress in case-reporting. Works as navigation tool.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { navigate } from "svelte-routing";
  import {
    isMapDisabled,
    isSummaryDisabled,
    isFeedbackPageDisabled
  } from "../store.js";

  export let category;
  export let map;
  export let summary;
  export let feedbackPage;
  export let toggleUndercategory;

  function navigateToCategory() {
    navigate("/kategori");
  }

  function navigateToMap() {
    navigate("/kart");
  }

  function navigateToSummary() {
    navigate("/oppsummering");
  }

  function navigateToFeedbacPage() {
    navigate("/saksbehandling");
  }
</script>

<style>
  /* Containers/divs */
  .container {
    display: flex;
    flex-direction: row;
    height: inherit;
    width: 260px;
    background: #f9f8f8;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
  }

  #stepProgressBar {
    margin: 5em 0 0 1.5em;
  }
  .step {
    display: flex;
  }
  .undercategories {
    display: flex;
  }
  .undercategories__textbox {
    display: flex;
    flex-direction: column;
  }
  .undercategory__onetext {
    margin-bottom: 1em;
  }

  /* Buttons */
  .step__button {
    background: #e9e9e9;
    border: #e9e9e9;
    width: 40px;
    height: 40px;
    padding: 6px 0px;
    border-radius: 25px;
    cursor: default;

    font-size: 12px;
    text-align: center;
    color: #004245;
    font-weight: bold;
    font-style: normal;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }
  button.this-step {
    background: #b2efec;
    box-shadow: 0px 9px 9px rgba(0, 0, 0, 0.25), 0px 0px 0px 9px #60d0cb;
    cursor: pointer;
    z-index: 1;
  }
  .been-clicked {
    background: #e9e9e9;
    cursor: pointer;
    border: #e9e9e9;
    width: 40px;
    height: 40px;
    padding: 6px 0px;
    border-radius: 25px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

    font-size: 14px;
    color: #004245;
    font-weight: bold;
  }
  .been-clicked:hover {
    z-index: 1;
    border: 2px solid #60d0cb;
    box-sizing: border-box;
  }
  .step__small-button {
    background: #e9e9e9;
    cursor: default;
    width: 20px;
    height: 20px;
    padding: 6px 0px;
    border-radius: 15px;
    border: #e9e9e9;
    margin: 0.5em 0 0 1em;
  }
  button.this-undercategory {
    background: #b2efec;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  /* Lines */
  longLine {
    border: 4px solid #e9e9e9;
    height: 15vh;
    margin: -3% 0 -2% 19px;
    width: 0;
  }
  /* Text styles*/
  smallBoldText {
    font-size: 1.9vh;
    margin-top: 13px;
    margin-left: 0.5em;
  }
  .undercategories-secondline {
    font-size: 13px;
    margin-left: 3.7em;
  }
  .category-maperror {
    font-size: 13px;
    color: #004245;
    margin: 0.6em;
  }
  .category-mapchanges {
    font-size: 13px;
    margin: 0.6em;
  }
</style>

<div class="container">
  <div id="stepProgressBar">
    <div class="step">
      <button
        class="been-clicked"
        class:this-step={category}
        on:click={navigateToCategory}>
        1
      </button>
      <smallBoldText>Kategori</smallBoldText>
    </div>

    <div class="undercategories">
      <longLine />
      {#if category}
        <div class="undercategories__textbox">
          <div class="undercategory__onetext">
            <button
              class="step__small-button"
              class:this-undercategory={toggleUndercategory} />
            <smallNormalText class="category-maperror">
              Hva gjelder feilen i kartet?
            </smallNormalText>

          </div>
          <div class="undercategory__onetext">
            <button
              class="step__small-button"
              class:this-undercategory={!toggleUndercategory} />
            <smallNormalText class="category-mapchanges">
              Hva ønsker du å
            </smallNormalText>
            <smallNormalText class="undercategories-secondline">
              gjøre i kartet?
            </smallNormalText>
          </div>
        </div>
      {/if}
    </div>
    <div class="step">
      <button
        class="step__button"
        class:this-step={map}
        class:been-clicked={!$isMapDisabled}
        on:click={navigateToMap}
        disabled={$isMapDisabled}>
        2
      </button>
      <smallBoldText>Marker i kartet</smallBoldText>
    </div>
    <div class="undercategories">
      <longLine />
      {#if map}
        <div class="undercategories__textbox">
          <div class="undercategory__onetext">
            <button
              class="step__small-button"
              class:this-undercategory={toggleUndercategory} />
            <smallNormalText class="category-maperror">
              Marker feilen i kartet
            </smallNormalText>
          </div>
          <div class="undercategory__onetext">
            <button
              class="step__small-button"
              class:this-undercategory={!toggleUndercategory} />
            <smallNormalText class="category-mapchanges">
              Dokumentasjon
            </smallNormalText>
          </div>
        </div>
      {/if}
    </div>
    <div class="step">
      <button
        class="step__button"
        class:this-step={summary}
        class:been-clicked={!$isSummaryDisabled}
        on:click={navigateToSummary}
        disabled={$isSummaryDisabled}>
        3
      </button>
      <smallBoldText>Oppsummering</smallBoldText>
    </div>
    <div class="undercategories">
      <longLine />

    </div>
    <div class="step">
      <button
        class="step__button"
        class:this-step={feedbackPage}
        on:click={navigateToFeedbacPage}
        class:been-clicked={!$isFeedbackPageDisabled}
        disabled={$isFeedbackPageDisabled}>
        4
      </button>
      <smallBoldText>Saksbehandling</smallBoldText>
    </div>
  </div>
</div>
