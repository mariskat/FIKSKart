<script>
  import { Router, Link, Route } from "svelte-routing";
  import Map from "./Pages/Map/Map.svelte";
  import Category from "./Pages/Category.svelte";
  import FrontPage from "./Pages/FrontPage.svelte";
  import PersonalPage from "./Pages/PersonalPage.svelte";
  import MyCases from "./Pages/MyCases.svelte";
  import Summary from "./Pages/Summary.svelte";
  import FeedbackPage from "./Pages/FeedbackPage.svelte";
  import Register from "./Pages/Register.svelte";
  import { isLoggedIn, user, role } from "./store.js";
  import Redirect from "./Redirect.svelte";
  import CaseFrontpage from "./CaseHandlerPages/CaseFrontpage.svelte";
  import Cases from "./CaseHandlerPages/Cases.svelte";
  import EditCase from "./CaseHandlerPages/EditCase.svelte";
  import CaseSummary from "./CaseHandlerPages/CaseSummary.svelte";
  import { auth, db } from "./firebase.js";

  export let url = "";
</script>

<Router {url}>
  <!-- Routes for user-->
  <Route path="opprett-bruker" component={Register} />
  <Route path="kategori" component={Category} />
  <Route path="kontaktinformasjon" component={PersonalPage} />
  <Route path="oppsummering" component={Summary} />
  <Route path="MineSaker" component={MyCases} />
  <Route path="kart" component={Map} />
  <Route path="saksbehandling" component={FeedbackPage} />

  <!-- Routes for case handlers-->
  <Route path="saksoversikt" component={Cases} />
  <Route path="redigere-sak" component={EditCase} />
  <Route path="oppsummering-sak" component={CaseSummary} />
  <Route path="innlogging-saksbehandler" component={CaseFrontpage} />

  <Route path="/">
    {#if $isLoggedIn && !$user.isAnonymous && $role === 'user'}
      <Redirect to="/kategori" />
    {:else if $isLoggedIn && !$user.isAnonymous && $role === 'case_handler'}
      <Redirect to="/saksoversikt" />
    {/if}
    <FrontPage />
  </Route>
</Router>
