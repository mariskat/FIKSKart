<script>
  /** file Header.svelte
   *  Header to be displayed at every page in the app
   *  Authors: Thea Tokstad and Marie Skatvedt
   */
  import { Link } from "svelte-routing";
  import Menu from "./Menu.svelte";
  import { isLoggedIn } from "../store.js";
  import { auth } from "../firebase.js";

  let personSource = "./images/person_icon.png";
  let appIconSource = "./images/fikskart_logo.png";
</script>

<style>
  header {
    display: flex;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    color: #f5f5f5;
    background-color: #157277;
    width: 100%;
    justify-content: space-between;
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

  /* Text */
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
</style>

<header>
  <nav>
    <Link to="/">
      <img class="appIcon" src={appIconSource} alt="app icon" />
    </Link>
  </nav>

  {#if $isLoggedIn && !auth.currentUser.isAnonymous}
    <div class="userInfo">
      <img class="personIcon" src={personSource} alt="meny icon" />
      <headername class="userName">{auth.currentUser.displayName}</headername>
      <Menu />
    </div>
  {/if}
</header>
