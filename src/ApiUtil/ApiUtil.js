export const reformatArticle= article=>{
    let key = Object.keys(article)
    let value = Object.keys(article)
    let newJson = {}
key.map((n,i)=>{
    switch (n){
        case 'article_name':
        key[i] = 'handle'
        break
        case 'article_body':
        key[i] = 'message'
        break

    }
newJson[key[i]]= value[i]
})
return newJson



}