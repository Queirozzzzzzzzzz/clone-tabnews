const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    process.stdout.write("Postgres está pronto e aceitando conexões!\n");
  }
}

process.stdout.write("\n\nAguardando Postgres aceitar conexões");
checkPostgres();
