function runIndex {
        while true; do
                node index.js >> logs.log 2>&1
                sleep 60
        done
}

runIndex