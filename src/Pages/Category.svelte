<script>
  /** file Category.svelte
   *  Buttons and page for choosing most general category - bygg, vei, eiendom, annet.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { fly, fade, blur } from "svelte/transition";
  import { Link } from "svelte-routing";
  import Header from "../Header/Header.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import { isMapDisabled, storeCategory, user } from "../store.js";
  import * as animateScroll from "svelte-scrollto";
  import { writable } from "svelte/store";

  let scrollContainer;
  let bottomElement;
  let category;
  let index;
  let imgIndex = 0;
  const isNotImplemented = writable(false);
  let isCategoryChosen = false;
  let nextStep = false;
  let infoTip = [false, false, false, false, false, false]; // Flags for toggling info-boxes

  let infoSource = "./images/info.png";
  let leftArrowSource = "./images/leftArrow.png";

  let categories = [
    {
      index: 1,
      id: "Vei",
      helpText: "Eks: Vei er ikke i kart, vei vises feil, vei eksisterer ikke",
      specifications: [
        {
          text: ["Ny vei", "Fjern vei"]
        }
      ],
      source: "./images/Vei.png"
    },
    {
      index: 2,
      id: "Bygg",
      helpText: "Eks: Hus, bod, naust, hundehus, dukkehus, vedskjul, garasje",
      specifications: [
        {
          text: [
            "Legg til bygg i kart",
            "Endre bygg i kart",
            "Fjerne bygg fra kart"
          ]
        }
      ],
      source: "./images/Bygg.png"
    },
    {
      index: 3,
      id: "Eiendomsgrenser",
      helpText: "Eks: Eiendomsgrenser er feil oppført eller mangler",
      specifications: [
        {
          text: ["Legg til eiendomsgrenser", "Fjern eiendomsgrenser"]
        }
      ],
      source: "./images/Eiendomsgrenser.png"
    },
    {
      index: 4,
      id: "Annet",
      helpText: "Eks: Naturminner, flomfare, støysoner",
      specifications: [
        {
          text: ["Annet"]
        }
      ],
      source: "./images/Annet.png"
    }
  ];

  let buildingSpecification = [
    {
      index: 6,
      src: "./images/Legg til bygg i kart.png",
      id: "Legg til bygg i kart",
      helpText: "Det er et bygg på kartet som ikke er på eiendommen"
    },
    {
      index: 7,
      src: "./images/Endre bygg i kart.png",
      id: "Endre bygg i kart",
      helpText:
        "Bygget er oppført feil i kartet. Feil størrelse, utforming eller plassering"
    },
    {
      index: 8,
      src: "./images/Fjerne bygg fra kart.png",
      id: "Fjerne bygg fra kart",
      helpText: "Det er et bygg på eiendommen som ikke er oppgitt i kartet"
    }
  ];

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

  /** Sets correct category chosen and its index.
   *  param c - Clicked categorybuttons corresponding category.id
   */
  function setCategories(c) {
    isCategoryChosen = true;
    category = c;
    index = categories.findIndex(i => i.id == c);
  }

  /** Saves the clicked category in session
   *  param text - text of chosen category
   */
  function setStoreCategories(text) {
    storeCategory.update(n => (n = category + ", " + text));
  }

  /** When dispatched, go back to front-page
   */
  function backToFrontpage() {
    dispatch("backToFrontPage");
  }
</script>

<style>
  /* Images */
  img.info {
    width: 20px;
  }

  img.specificImage {
    margin: 2vh;
    width: 5vh;
  }

  img.categoryImage {
    margin: 2vh;
    width: 5vh;
    margin-right: 4vh;
  }

  /* Frames */
  mainContent {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  titleFrame {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 7vh;
    margin-top: 8vh;
    height: 2vh;
  }

  titleFrame.lowerPage {
    margin-top: 33vh;
    margin-bottom: 10vh;
  }

  centerContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    align-items: center;
  }

  pageView {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  filler {
    width: 20%;
  }

  content {
    flex-grow: 1;
    height: 100vh;
  }

  .help-box {
    width: 233px;
    margin-left: 17px;
  }

  infoBox {
    height: 1vh;
    z-index: 5;
    position: absolute;
    bottom: 19%;
  }

  infoRow {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  nav {
    width: auto;
  }

  innerVerticalContent {
    display: flex;
    flex-direction: column;
    width: inherit;
    height: inherit;
  }

  div.background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    opacity: 20%;
    background: rgb(21, 114, 119);
    backdrop-filter: blur(5px);
    z-index: 4;
  }

  navigationButtons {
    display: flex;
    flex-direction: column;
  }

  .notImplementedInfo {
    display: inline-flex;
    flex-direction: column;
    width: fit-content;
    display: inline-flex;
    flex-direction: column;
    position: relative;
    width: 233px;
  }

  /* Buttons */
  button.backButton {
    background: #f9f8f8;
    z-index: 5;
  }
</style>

{#if $isNotImplemented}
  <div class="background" />
{/if}
<main>
  <Header />
  <mainContent>

    <verticalBar>
      <ProgressBar category={true} toggleUndercategory={!nextStep} />
    </verticalBar>

    <centerContent bind:this={scrollContainer}>
      <innerVerticalContent>
        <pageView>
          <filler />
          <content>

            <titleFrame>
              <title>Hva gjelder feilen i kartet?</title>
              <button
                class="info"
                on:mousemove={() => showHelpBox(0)}
                on:mouseout={() => hideHelpBox(0)}>
                <img class="info" src={infoSource} alt="info icon" />
              </button>
              <div class="help-box">
                {#if infoTip[0]}
                  <smallNormalText class="submit-text">
                    Velg den kategorien som best passer feilen du har funnet i
                    kartet. Hold musen over knappene for å vise eksempler. Du
                    kan kun melde i fra om en feil om gangen
                  </smallNormalText>
                {/if}
              </div>
            </titleFrame>

            {#each categories as category}
              <infoRow>
                <button
                  class="bigButton"
                  on:mousemove={() => showHelpBox(category.index)}
                  on:mouseout={() => hideHelpBox(category.index)}
                  on:click={() => {
                    setCategories(category.id);
                    imgIndex = 1;
                    nextStep = true;
                    if (category.id != 'Bygg') {
                      isNotImplemented.set(true);
                    }
                  }}
                  on:click={() => animateScroll.scrollTo({
                      element: bottomElement,
                      container: scrollContainer
                    })}>
                  <img
                    class={'categoryImage'}
                    src={category.source}
                    alt="category img" />
                  <buttonText>{category.id}</buttonText>
                </button>
                <div class="help-box">
                  {#if infoTip[category.index]}
                    <smallNormalText class="submit-text">
                      {category.helpText}
                    </smallNormalText>
                  {/if}
                </div>
              </infoRow>
              <br />
            {/each}
            <br />
            <br />
          </content>
        </pageView>
        {#if isCategoryChosen}
          <pageView>
            <filler />
            <content>

              <titleFrame class="lowerPage">
                <title class="spesTitle">Hva ønsker du å gjøre i kartet?</title>
                <button
                  class="info"
                  on:mousemove={() => showHelpBox(5)}
                  on:mouseout={() => hideHelpBox(5)}>
                  <img class="info" src={infoSource} alt="info icon" />
                </button>
                <div class="help-box">
                  {#if infoTip[5]}
                    <smallNormalText class="submit-text">
                      Velg den kategorien som best passer feilen du har funnet i
                      kartet. Hold musen over knappene for å vise eksempler. Du
                      kan kun melde i fra om en feil om gangen
                    </smallNormalText>
                  {/if}
                </div>
              </titleFrame>

              <spesButtons>
                {#if categories[index].id != 'Bygg'}
                  {#each categories[index].specifications as specification}
                    {#each specification.text as text}
                      <button
                        class="bigButton"
                        on:click={() => {
                          setStoreCategories(text);
                          isMapDisabled.update(n => (n = false));
                        }}>
                        <img
                          class="specificImage"
                          src={'./images/' + categories[index].id + '.png'}
                          alt="category img" />
                        {text}
                      </button>
                      <br />
                    {/each}
                  {/each}
                {:else}
                  {#each buildingSpecification as specification}
                    <infoRow>
                      <nav>
                        <Link className="specifications" to="kart">
                          <button
                            class="bigButton"
                            on:mousemove={() => showHelpBox(specification.index)}
                            on:mouseout={() => hideHelpBox(specification.index)}
                            on:click={() => {
                              setStoreCategories(specification.id);
                              isMapDisabled.update(n => (n = false));
                            }}>
                            <img
                              class="specificImage"
                              src={specification.src}
                              alt="undercategory img" />
                            <buttonText>{specification.id}</buttonText>
                          </button>
                        </Link>
                      </nav>
                      <div class="help-box">
                        {#if infoTip[specification.index]}
                          <smallNormalText class="submit-text">
                            {specification.helpText}
                          </smallNormalText>
                        {/if}
                      </div>
                    </infoRow>
                    <br />
                  {/each}
                  <br />
                {/if}
              </spesButtons>

            </content>
          </pageView>
        {/if}

        <navigationButtons>
          <infoBox>
            <div class="notImplementedInfo">
              {#if $isNotImplemented}
                <smallNormalText class="submit-text">
                  Denne funksjonaliteten er ikke tilgjengelig enda. Vennligst
                  velg bygg.
                </smallNormalText>
              {/if}
            </div>
          </infoBox>
          <button
            class="backButton"
            bind:this={bottomElement}
            on:click={() => {
              animateScroll.scrollToTop({ container: scrollContainer });
              imgIndex = 0;
              isNotImplemented.set(false);
              nextStep = false;
            }}>
            <backButtonText>
              <img class="backArrow" src={leftArrowSource} alt="back icon" />
              <smallBoldText>Tilbake</smallBoldText>
            </backButtonText>
          </button>
        </navigationButtons>

      </innerVerticalContent>
    </centerContent>
  </mainContent>
</main>
