<script>
  import { signUp as signUpFirebase } from "./Firebase.js";

  let email;
  let password;
  let errorMessage;

  function signUp() {
    signUpFirebase(email, password)
      .then(data => {
        console.log("Bruker er registrert", data);
      })
      .catch(error => {
        console.log(error);
        errorMessage = "Brukerregistrering mislyktes";
      });
  }
</script>

<style>

</style>

<input bind:value={email} placeholder="E-post" />
<input bind:value={password} placeholder="Passord" type="password" />
<button on:click={signUp}>Registrer bruker</button>
<br />
{errorMessage !== undefined ? errorMessage : ''}
