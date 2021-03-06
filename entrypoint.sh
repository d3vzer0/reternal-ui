#!/bin/sh
set -e

CONFIG_PATH=/usr/share/nginx/html/js/app.*.js

sed -i 's,RT_API_BASE_URL,'"$RT_API_BASE_URL"',g' $CONFIG_PATH
sed -i 's,RT_OAUTH_AUTHORITY_URL,'"$RT_OAUTH_AUTHORITY_URL"',g' $CONFIG_PATH
sed -i 's,RT_OAUTH_AUTHORIZE_URL,'"$RT_OAUTH_AUTHORIZE_URL"',g' $CONFIG_PATH
sed -i 's,RT_OAUTH_CLIENT_ID,'"$RT_OAUTH_CLIENT_ID"',g' $CONFIG_PATH
sed -i 's,RT_OAUTH_REDIRECT_URL,'"$RT_OAUTH_REDIRECT_URL"',g' $CONFIG_PATH

exec "$@"