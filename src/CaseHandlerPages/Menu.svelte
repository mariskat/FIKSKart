<script>
  /** file Menu.svelte
   *  Menu that shows the different pages on the case holder side.
   *  Authors: Thea Tokstad and Marie Skatvedt
   */

  import { links, Link } from "svelte-routing";
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { navigate } from "svelte-routing";
  import { signOut as signOutFirebase } from "../firebase.js";
  import { isLoggedIn, user } from "../store.js";

  let firstSource = "./images/menu.png";
  let sectionSource = "./images/light_menu.png";

  const isMenuOpened = writable(false);

  const menuRight = tweened(100, {
    duration: 200,
    easing: cubicOut
  });

  const menuOuterRight = tweened(80, {
    duration: 200,
    easing: cubicOut
  });

  const menuBackground = tweened(80, {
    duration: 200,
    easing: cubicOut
  });

  const closeMenu = () => {
    menuRight.set(100);
    menuOuterRight.set(80);
    isMenuOpened.set(false);
    menuBackground.set(80);
  };

  const openMenu = () => {
    menuRight.set(80);
    menuOuterRight.set(90);
    isMenuOpened.set(true);
    menuBackground.set(100);
  };

  /** Signs user out **/
  function signOut() {
    signOutFirebase()
      .then(function() {
        isLoggedIn.update(n => (n = false));
        navigate("/", { replace: true });
      })
      .catch(function(error) {
        //Error message
      });
  }
</script>

<style>
  * {
    color: #004245;
    border: 0;
  }

  /* Menu */
  div.menu {
    background: #ffffff;
    box-shadow: -4px -4px 4px rgba(0, 0, 0, 0.25);
    position: absolute;
    z-index: 500;

    height: 1024px;
    right: 0;
    top: 0px;
  }
  div.menuOuter {
    width: 3em;
    position: right;
    top: 0;
    left: 0;
    text-align: center;
  }
  div.menuInner {
    align-content: center;
    width: 20vw;
    height: 20vh;
    position: absolute;
    background: #ffffff;
    top: 9vh;
  }

  /* Menu image */
  img {
    width: 32px;
    height: 24px;
    margin-top: 0.38em;
  }

  /* Text */
  smallBoldText {
    margin: 10px;
    position: absolute;
    left: 56px;
  }

  /* Menu items */
  .menuItem:hover {
    background: #dff6f5;
    cursor: pointer;
  }
  .menuItem {
    background: #ffffff;
    position: absolute;
    width: 100%;
    height: 5vh;
    left: 0;
    margin-bottom: 1em;
  }

  /* Buttons */
  button.closeMenu {
    background: #ffffff;
    position: absolute;
    top: -44px;
    height: -66px;
    right: 38px;
    border: none;
  }
  button.openMenuButton {
    color: #f5f5f5;
    background: #157277;
    border: 0;
    margin-right: 1em;
  }

  /* Blurred background when menu open */
  div.background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    opacity: 20%;
    background: rgb(21, 114, 119);
    backdrop-filter: blur(5px);
  }
</style>

{#if $isMenuOpened}
  <div class="background" />
{/if}

<mainContainer>
  <div class="menuOuter" />
  {#if !$isMenuOpened}
    <button class="openMenuButton" on:click={() => openMenu()}>
      <img src={firstSource} alt="meny icon" />
    </button>
  {/if}

  <div class="menu" style="left: {$menuRight}vw;">
    <div class="menuInner" use:links>
      {#if $isMenuOpened}
        <button class="closeMenu" on:click={() => closeMenu()}>
          <img src={sectionSource} alt="lightMenu" class="closeMenu" />
        </button>
      {/if}
      <br />
      <br />
      <a
        href="/kontaktinformasjon"
        class="menuItem"
        on:click={() => closeMenu()}>
        <smallBoldText>{$user.displayName}</smallBoldText>
      </a>

      <div class="menuItem" on:click={signOut}>
        <smallBoldText>Logg ut</smallBoldText>
      </div>
    </div>
  </div>
</mainContainer>
