import './invenio_app_ils';

/* WHY THIS?
 * create-react-app forces to have the app source in a folder called `src`, but this breaks Invenio assets build, which
 * requires to namespace your JS app.
 * This index.js is a workaround to allow re-structure the React application and still expose it in a `src` folder.
 */
