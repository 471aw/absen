(() => {
  "use strict";
  const API_URL = "https://api-absen.skai.my.id/api";
  const DEFAULT_TIMEOUT_MS = 90000;

  async function call(method, ...args) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ method, args }),
        signal: controller.signal
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Respons API tidak valid.");
      }

      if (!response.ok || !data || data.ok !== true) {
        throw new Error((data && data.error) || ("API error " + response.status));
      }
      return data.result;
    } catch (err) {
      if (err && err.name === "AbortError") {
        throw new Error("Koneksi ke server terlalu lama. Silakan coba lagi.");
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  window.AbsensiAPI = Object.freeze({ call, url: API_URL });
})();
