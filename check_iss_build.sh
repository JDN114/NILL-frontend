#!/bin/bash

echo ""
echo "==============================="
echo " ISS BUILD CHECK"
echo "==============================="
echo ""

cd /root/nill/frontend || exit 1

npm run build

echo ""
echo "DONE"
