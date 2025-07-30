// instrumentation-client.js
import posthog from 'posthog-js'
import { env } from './env';

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: "/relay-LwCv",
  ui_host: 'https://eu.posthog.com'
});
            