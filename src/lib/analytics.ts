const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const GA_LOCAL_DISABLE_SCRIPT = `if(${JSON.stringify(LOCAL_HOSTNAMES)}.includes(location.hostname))window["ga-disable-${GA_MEASUREMENT_ID}"]=true;`;
