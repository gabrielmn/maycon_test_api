function uriExtractor(uri) {
    const split = uri.split(",")
    let regex = /^data:.+\/(.+);base64$/;

    let matches = regex.exec(split[0]);
    return [
        split[1],
        matches[1]
    ]
}

module.exports = {
    uriExtractor
}