export const BASE_URL =
  typeof window === "undefined" ? process.env.BACKEND_URL : "/api/proxy";

const fetchWithTimeout = async (url, options = {}) => {
  const { timeout = 30000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export async function dnssinkhole(accessToken) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/pcaps/dns-sinkhole`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch dnsrequest:${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.log("error while fetching data from dns-sinkhole", error);
    throw error;
  }
}
