import { base_url, base_url_test, env } from '../../Config'

//env
//0 = test
//1 = product

let api_base = base_url

if (env == 1) {
    api_base = base_url
} else if (env == 0) {
    api_base = base_url_test
}


export default api_base;