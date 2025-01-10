import axios from 'axios';


const apiClient = axios.create({
  baseURL: '/api',
});


apiClient.interceptors.response.use(
  response => response, 
  async error => {
    console.log(error);
    
    if (error.response && error.response.status === 401) {
        const refreshToken = localStorage.getItem('refresh');
        console.log(refreshToken);
      try {
        const refreshResponse = await axios.get('/api/auth/refresh', {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
        });
        
        const newAccessToken = refreshResponse.data.accessToken;

        // Сохраняем новый access token
        localStorage.setItem('access', newAccessToken);

        // Обновляем заголовок и повторяем исходный запрос
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient.request(error.config);
      } catch (refreshError) {
        // Если обновление токена не удалось, перенаправляем на страницу входа
        console.error('Не удалось обновить токен', refreshError);
        window.location.href('/login')
        return Promise.reject(refreshError);
      }
    }

    // Если ошибка не 401, возвращаем ее дальше
    return Promise.reject(error);
  }
);

export default apiClient;
