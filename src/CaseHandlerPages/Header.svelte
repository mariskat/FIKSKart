<script>
  /** file Header.svelte
   *  Header to be displayed at every page in the app for the case holder
   *  Authors: Thea Tokstad and Marie Skatvedt
   */
  import { Link } from "svelte-routing";
  import Menu from "./Menu.svelte";
  import { isLoggedIn, user } from "../store.js";

  let personIconSource = "./images/person_icon.png";
  let appIconSource = "./images/LogoIntern.png";
</script>

<style>
  header {
    display: flex;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    color: #f5f5f5;
    background-color: #157277;
    width: 100%;
    justify-content: space-between;
    z-index: 10;
  }
  .userInfo {
    font-weight: 500;
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  .userInfo:hover {
    cursor: default;
  }
  .userName {
    margin-right: 4em;
    font-size: 2vh;
  }

  /* Images */
  img.personIcon {
    width: 21.91px;
    margin-bottom: 8px;
    margin-right: 15px;
  }
  img.appIcon {
    margin-left: 2em;
    margin-top: 3vh;
    margin-bottom: 3vh;
    height: 8vh;
  }
</style>

<header>
  <nav>
    <Link to="/">
      <img class="appIcon" src={appIconSource} alt="app icon" />
    </Link>
  </nav>

  {#if $isLoggedIn && !$user.isAnonymous}
    <div class="userInfo">
      <img class="personIcon" src={personIconSource} alt="meny icon" />
      <headername class="userName">{$user.displayName}</headername>
      <Menu />
    </div>
  {/if}
</header>
