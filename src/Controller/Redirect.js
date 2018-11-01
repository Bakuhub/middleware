import * as ApiUtil from "../ApiUtil/ApiUtil";
import axios from "axios/index";
import * as ENV from "../Constants/ENV";


export const redirectRecordToWebsite =  (webHook, record) => {


    axios.defaults.headers.common['Content-Type'] = webHook.contentType
      axios(
        {
            headers: {
                Authorization: ENV.redirectDefaultAuthorization,
            },
            method: webHook.httpMethod === 'default' ? record.type : webHook.httpMethod,
            data: record.body,
            url: webHook.redirectPath,
        }
    ).then(response =>
        JSON.parse(ApiUtil.cleanStringify(response))
    ).catch(error => JSON.parse(ApiUtil.cleanStringify(error)))


}
