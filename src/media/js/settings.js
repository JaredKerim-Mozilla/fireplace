define('settings', ['l10n', 'settings_local', 'underscore'], function(l10n, settings_local, _) {
    var gettext = l10n.gettext;

    var base_settings = JSON.parse(document.body.getAttribute('data-settings') || '{}');
    base_settings = _.defaults(base_settings, settings_local);

    // When in "preview mode", don't send the feature profile to the API.
    var param_blacklist = (
        window.location.search || '').indexOf('preview=true') > 0 ? ['pro'] : null;

    // Temporary while we figure out how to fix feature detection, blacklist
    // 'pro' even when not in "preview mode". see bug 980124 and bug 979932
    param_blacklist = ['pro'];

    function offline_cache_enabled() {
        var storage = require('storage');
        if (storage.getItem('offline_cache_disabled') || require('capabilities').phantom) {
            return false;
        }
        return window.location.search.indexOf('cache=false') === -1;
    }

    return _.defaults(base_settings, {
        app_name: 'fireplace',
        init_module: 'main',
        default_locale: 'en-US',
        api_url: 'http://' + window.location.hostname,  // No trailing slash, please.

        fxa_css_path: '/media/css/fxa.css',

        package_version: null,

        // The version number for localStorage data. Bump when the schema for
        // storing data in localStorage changes.
        storage_version: '0',

        // Set to true to simulate navigator.mozPay.
        simulate_nav_pay: false,

        // The list of query string parameters that are not stripped when
        // removing navigation loops.
        param_whitelist: ['q', 'sort', 'cat'],

        // The list of query string parameters that are not replaced
        // reversing API URLs.
        api_param_blacklist: param_blacklist,

        // These are the only API endpoints that should be served from the CDN
        // (key: URL; value: max-age in seconds, but it's unused at the moment).
        api_cdn_whitelist: {
            '/api/v2/fireplace/search/': 60 * 3,  // 3 minutes
            '/api/v2/feed/get/': 60 * 30,  // 30 minutes
            '/api/v2/services/config/site/': 60 * 3  // 3 minutes
        },

        // The list of models and their primary key mapping. Used by caching.
        model_prototypes: {
            'app': 'slug',
            'category': 'slug',
            'collection': 'slug',

            'feed-app': 'slug',
            'feed-brand': 'slug',
            'feed-collection': 'slug',
            'feed-shelf': 'slug',

            // Dummy prototypes to facilitate testing:
            'dummy': 'id',
            'dummy2': 'id'
        },

        // These are the only URLs that should be cached
        // (key: URL; value: TTL [time to live] in seconds).
        // Keep in mind that the cache is always refreshed asynchronously;
        // these TTLs apply to only when the app is first launched.
        offline_cache_whitelist: {
            '/api/v2/feed/get/': 60 * 60 * 24 * 7,  // 1 week
            '/api/v2/fireplace/consumer-info/': 60 * 60 * 24 * 7,  // 1 week
            '/api/v2/services/config/site/': 60 * 60 * 24 * 7  // 1 week
        },
        offline_cache_enabled: offline_cache_enabled,
        offline_cache_limit: 1024 * 1024 * 4,  // 4 MB

        // Error template paths. Used by builder.js.
        fragment_error_template: 'errors/fragment.html',
        pagination_error_template: 'errors/pagination.html',

        // Switches for features.
        payments_enabled: true,
        tracking_enabled: false,
        action_tracking_enabled: true,
        upsell_enabled: true,
        newsletter_enabled: true,
        cache_rewriting_enabled: true,
        potatolytics_enabled: false,

        // Waffle switches from the server.
        switches: [],  // Updated after consumer-info is called.

        // Enabling this settings will mock compatibility with all apps.
        never_incompat: false,

        // The UA tracking ID for this app.
        ua_tracking_id: 'UA-36116321-6',
        tracking_section: 'Consumer',
        tracking_section_index: 3,

        // A list of regions and their L10n mappings.
        REGION_CHOICES_SLUG: {
            'restofworld': gettext('Rest of World'),
            'ar': gettext('Argentina'),
            'bd': gettext('Bangladesh'),
            'br': gettext('Brazil'),
            'cl': gettext('Chile'),
            'cn': gettext('China'),
            'co': gettext('Colombia'),
            'cr': gettext('Costa Rica'),
            'cz': gettext('Czech Republic'),
            'ec': gettext('Ecuador'),
            'sv': gettext('El Salvador'),
            'fr': gettext('France'),
            'de': gettext('Germany'),
            'gr': gettext('Greece'),
            'gt': gettext('Guatemala'),
            'hu': gettext('Hungary'),
            'in': gettext('India'),
            'it': gettext('Italy'),
            'jp': gettext('Japan'),
            'mx': gettext('Mexico'),
            'me': gettext('Montenegro'),
            'ni': gettext('Nicaragua'),
            'pa': gettext('Panama'),
            'pe': gettext('Peru'),
            'pl': gettext('Poland'),
            'rs': gettext('Serbia'),
            'es': gettext('Spain'),
            'uk': gettext('United Kingdom'),
            'us': gettext('United States'),
            'uy': gettext('Uruguay'),
            've': gettext('Venezuela'),
            'None': gettext('No region in search')
        },

        // A data URI of the project logo (shown when logging in via Persona).
        persona_site_logo: base_settings.media_url + '/fireplace/img/logos/128.png',
        persona_tos: null,
        persona_privacy: null,

        // The Persona unverified issuer origin. Used by login.js.
        persona_unverified_issuer: 'login.persona.org',

        // How long to wait before giving up on loading Persona's include.js.
        persona_timeout: 30000,  // 30 seconds

        // URL to Persona's include.js.
        persona_shim_url: 'https://login.persona.org/include.js',

        // The string to suffix page titles with. Used by builder.js.
        title_suffix: 'Firefox Marketplace',

        // The hardcoded carrier. This is expected to be falsey or an object
        // in the form {name: 'foo', slug: 'bar'}
        carrier: null,

        iframe_installer_src: 'https://marketplace.firefox.com/iframe-install.html',
        iframe_potatolytics_src: 'https://marketplace.firefox.com/potatolytics.html',
        offline_msg: gettext('Sorry, you are currently offline. Please try again later.'),
    });
});
