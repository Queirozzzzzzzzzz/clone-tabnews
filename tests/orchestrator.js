import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 5000,
  });

  async function fetchStatusPage() {
    const res = await fetch("http://localhost:3000/api/v1/status");
    if (!res.ok) throw Error();
  }
}

export default {
  waitForAllServices,
};
