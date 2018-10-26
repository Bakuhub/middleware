export const reformatArticle = article => {
    let key = Object.keys(article)
    let value = Object.keys(article)
    let newJson = {}
    key.map((n, i) => {
        switch (n) {
            case 'article_name':
                key[i] = 'handle'
                break
            case 'article_body':
                key[i] = 'message'
                break

        }
        newJson[key[i]] = value[i]
    })
    return newJson


}

export const preventCircularJson = (o) => {
    let cache = [];

    JSON.stringify(o, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });

    return cache
}