export function isAuthenticated() {
	return !!localStorage.getItem("access"); // Проверка наличия токена
}