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


export const  cleanStringify=(object)=> {
    if (object && typeof object === 'object') {
        object = copyWithoutCircularReferences([object], object);
    }
    return JSON.stringify(object);

    function copyWithoutCircularReferences(references, object) {
        var cleanObject = {};
        Object.keys(object).forEach(function(key) {
            var value = object[key];
            if (value && typeof value === 'object') {
                if (references.indexOf(value) < 0) {
                    references.push(value);
                    cleanObject[key] = copyWithoutCircularReferences(references, value);
                    references.pop();
                } else {
                    cleanObject[key] = '###_Circular_###';
                }
            } else if (typeof value !== 'function') {
                cleanObject[key] = value;
            }
        });
        return cleanObject;
    }
}