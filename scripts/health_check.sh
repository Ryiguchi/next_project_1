response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$response" = "200" ]; then
    echo "Website is up and running."
    exit 0  # Success
else
    echo "Website is not responding as expected (HTTP $response)"
    exit 1  # Failure
fi