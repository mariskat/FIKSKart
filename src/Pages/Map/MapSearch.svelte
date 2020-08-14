<script>
  /** file MapSearch.svelte
   *  Search field for address in map.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { createEventDispatcher } from "svelte";
  import { addressToFirebase } from "../../store.js";

  let searchIconSrc = "./images/grey_search_icon.png";
  let timerIconSrc = "./images/timerIcon.png";
  let arrowDownSrc = "./images/arrowdown.png";
  let homeIconSrc = "./images/Bygg.png";
  let removeAddressSrc = "./images/removeAddress.png";

  let selectedAddress;
  let isAddressSearched = false;
  let addressFirst = "Birkebeinervegen 11";
  let postcodeFirst = "Hamar";
  let addressSec = "Røreks gate 3";
  let postcodeSec = "Hamar";
  const dispatch = createEventDispatcher();

  /** When address is searched (button pressed), save address to firebase and go to address
   *  param add - Which address is searched (currently 1 or 2)
   */
  function addressSearched(add) {
    isAddressSearched = true;
    if (add == 1) {
      selectedAddress = addressFirst + " " + postcodeFirst;
      dispatch("firstAddressSearched");
      addressToFirebase.set(selectedAddress);
    } else {
      selectedAddress = addressSec + " " + postcodeSec;
      dispatch("secAddressSearched");
      addressToFirebase.set(selectedAddress);
    }
  }
</script>

<style>
  .search-bar {
    position: relative;
    display: inline-flex;
    background: #ffffff;
    border-radius: 8px;

    margin-top: 10px;
    margin-left: 10px;
    z-index: 10;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  /* Inputs */
  input:hover {
    box-shadow: none;
  }

  input:focus {
    box-shadow: none;
  }

  .search-bar__input {
    border: none;
    color: #004245;
    padding-left: 1.5em;
    outline: none;
    width: 316px;
  }
  ::placeholder {
    color: #c4c4c4;
  }

  /* Buttons */

  button.removeAddress {
    background: inherit;
    border: none;
  }

  ::-webkit-search-cancel-button {
    display: none;
  }
  .search-bar__button {
    background: none;
    border: none;
    margin: 0;
    position: absolute;
    right: 9px;
    top: 26%;
  }

  /* Images */
  img.search {
    height: 21px;
  }
  img.timer {
    object-fit: scale-down;
    height: 1.6vh;
    margin-left: 20px;
  }
  img.arrowdown {
    position: absolute;
    height: 0.8vh;
    margin-left: 20px;
    object-fit: scale-down;
  }
  img.home {
    position: absolute;
    /* bottom: 14px; */
    height: 17px;
    margin-left: 14px;
    width: 17px;
  }
  img.cross {
    width: 13.8px;
    height: 13.9px;
  }

  /* Frames*/
  .dropdown {
    position: relative;
    display: inline-block;
  }
  .dropdown-content {
    display: none;
    background: #ffffff;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
    width: -webkit-fill-available;
    cursor: pointer;
  }
  .dropdown-content-first {
    display: none;
    position: absolute;
    background: #ffffff;
    border-radius: 0px 0px 8px 8px;
    margin-left: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    z-index: 1;
    width: -webkit-fill-available;
  }
  .dropdown:hover .dropdown-content-first {
    display: block;
  }
  .dropdown-content-first:hover {
    display: none;
  }
  .dropdown-content-first:hover .dropdown-content {
    display: block;
  }
  dropdownAlternatives {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .addressSearchedFor {
    display: flex;
    width: 316px;
    height: 43px;
    left: 520px;
    top: 344px;
    background: #ffffff;
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    margin-left: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    cursor: pointer;
  }
  .addressSearchedFor:hover,
  dropdownAlternatives.selectable:hover {
    background: #dff6f5;
  }
  dropdownAlternatives.selectableLast:hover {
    border-radius: 0px 0px 8px 8px;
    background: #dff6f5;
  }

  /* Text */
  darkDropdownText {
    font-style: normal;
    font-weight: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 4vh;
    display: flex;
    align-items: center;
    color: #004245;
    margin-left: 2vh;
  }
  darkDropdownText.address {
    line-height: 4.5vh;
    margin-left: 5vh;
    width: 228px;
  }
  lightDropdownText {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;
    margin-left: 1vh;
    color: #c4c4c4;
  }
  darkDropdownText.firsttext {
    color: #6d6d6d;
    margin-left: 47px;
  }
</style>

{#if !isAddressSearched}
  <div class="dropdown">
    <span class="search-bar">
      <input
        type="search"
        class="search-bar__input"
        placeholder="Søk etter adresse" />
      <button
        class="search-bar__button"
        on:click={() => dispatch('findThisArea')}>
        <img class="search" src={searchIconSrc} alt="search icon" />
      </button>
    </span>
    <div class="dropdown-content-first">
      <dropdownAlternatives>
        <img class="arrowdown" src={arrowDownSrc} alt="arrow icon" />
        <darkDropdownText class="firsttext">
          Se foreslåtte og tidligere brukte adresser
        </darkDropdownText>
      </dropdownAlternatives>
      <div class="dropdown-content">
        <dropdownAlternatives
          class="selectable"
          on:click={() => addressSearched(1)}>
          <img class="timer" src={timerIconSrc} alt="timer icon" />
          <darkDropdownText>{addressFirst}</darkDropdownText>
          <lightDropdownText>{postcodeFirst}</lightDropdownText>
        </dropdownAlternatives>
        <dropdownAlternatives
          class="selectableLast"
          on:click={() => addressSearched(2)}>
          <img class="timer" src={timerIconSrc} alt="timer icon" />
          <darkDropdownText>{addressSec}</darkDropdownText>
          <lightDropdownText>{postcodeSec}</lightDropdownText>
        </dropdownAlternatives>
      </div>
    </div>
  </div>
{:else}
  <div
    class="addressSearchedFor"
    on:click={() => {
      dispatch('goToAddress');
    }}>
    <img class="home" src={homeIconSrc} alt="home icon" />
    <darkDropdownText class="address">{selectedAddress}</darkDropdownText>
    <button
      class="removeAddress"
      on:click={() => {
        isAddressSearched = false;
        dispatch('cancelAddress');
      }}>
      <img class="cross" src={removeAddressSrc} alt="cross icon" />
    </button>
  </div>
{/if}
