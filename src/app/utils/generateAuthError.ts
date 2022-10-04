export function generetaAuthError(message: string) {
  switch (message) {
    case "INVALID_PASSWORD":
      return "Email или пароль введены некорректно";
    case "EMAIL_EXISTS":
      return "Пользователь с таким Email уже существует";
    default:
      return "Сесия авторизации истекла. Войдите повторно";
  }
}
