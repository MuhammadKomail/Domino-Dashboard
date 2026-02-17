/***** Api call methods are defined here *****/

type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';

const apiCallMethods: Record<string, HttpMethod> = {
    post: 'POST',
    get: 'GET',
    put: 'PUT',
    delete: 'DELETE',
    patch: 'PATCH'
};

export default apiCallMethods;