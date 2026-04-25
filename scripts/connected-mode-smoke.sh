#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:4000}"
OPENSEARCH_URL="${OPENSEARCH_URL:-http://127.0.0.1:9200}"
OPENSEARCH_INDEX="${OPENSEARCH_INDEX:-products}"
WAIT_SECONDS="${SMOKE_WAIT_SECONDS:-4}"
PRODUCT_ID="DG-SMOKE-$(date +%s)"

opensearch_auth_header() {
  if [[ -n "${OPENSEARCH_API_KEY:-}" ]]; then
    printf 'Authorization: ApiKey %s' "$OPENSEARCH_API_KEY"
    return
  fi

  if [[ -n "${OPENSEARCH_USERNAME:-}" && -n "${OPENSEARCH_PASSWORD:-}" ]]; then
    local token
    token="$(printf '%s:%s' "$OPENSEARCH_USERNAME" "$OPENSEARCH_PASSWORD" | base64)"
    printf 'Authorization: Basic %s' "$token"
    return
  fi

  printf ''
}

AUTH_HEADER="$(opensearch_auth_header)"

curl_json() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  if [[ -n "$data" ]]; then
    curl -sS -X "$method" "$url" -H 'Content-Type: application/json' -d "$data"
  else
    curl -sS -X "$method" "$url"
  fi
}

curl_os_status() {
  local method="$1"
  local url="$2"
  if [[ -n "$AUTH_HEADER" ]]; then
    curl -sS -o /tmp/dg-os-smoke.json -w '%{http_code}' -X "$method" "$url" -H "$AUTH_HEADER"
  else
    curl -sS -o /tmp/dg-os-smoke.json -w '%{http_code}' -X "$method" "$url"
  fi
}

echo "1) API health check"
HEALTH_JSON="$(curl_json GET "$API_BASE_URL/api/health")"
echo "$HEALTH_JSON"

echo "2) Create product via admin API"
CREATE_PAYLOAD="{\"id\":\"$PRODUCT_ID\",\"name\":\"Smoke Validation Product\",\"category\":\"ring\",\"priceMin\":50000,\"priceMax\":65000,\"purity\":\"22k\",\"weightGrams\":8.5,\"styles\":[\"modern\"],\"occasions\":[\"engagement\"],\"images\":[\"https://example.com/smoke.jpg\"],\"description\":\"Connected mode smoke test product.\"}"
CREATE_RESPONSE="$(curl_json POST "$API_BASE_URL/api/admin/catalog/products" "$CREATE_PAYLOAD")"
echo "$CREATE_RESPONSE"

echo "3) Waiting ${WAIT_SECONDS}s for worker queue processing"
sleep "$WAIT_SECONDS"

echo "4) Validate OpenSearch document exists"
DOC_STATUS="$(curl_os_status GET "$OPENSEARCH_URL/$OPENSEARCH_INDEX/_doc/$PRODUCT_ID")"
if [[ "$DOC_STATUS" != "200" ]]; then
  echo "OpenSearch doc lookup failed (status=$DOC_STATUS)."
  echo "Response:"
  cat /tmp/dg-os-smoke.json
  exit 1
fi

echo "OpenSearch document found for $PRODUCT_ID"

echo "5) Delete product via admin API"
DELETE_RESPONSE="$(curl_json DELETE "$API_BASE_URL/api/admin/catalog/products/$PRODUCT_ID")"
echo "$DELETE_RESPONSE"

echo "6) Waiting ${WAIT_SECONDS}s for cleanup job"
sleep "$WAIT_SECONDS"

echo "7) Validate OpenSearch document removed"
DOC_DELETE_STATUS="$(curl_os_status GET "$OPENSEARCH_URL/$OPENSEARCH_INDEX/_doc/$PRODUCT_ID")"
if [[ "$DOC_DELETE_STATUS" != "404" ]]; then
  echo "Expected OpenSearch 404 after delete, got status=$DOC_DELETE_STATUS"
  echo "Response:"
  cat /tmp/dg-os-smoke.json
  exit 1
fi

echo "Connected-mode smoke test passed"
