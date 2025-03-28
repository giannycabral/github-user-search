// src/js/api.js

const API_URL = "https://api.github.com/users/";

export const fetchUser = async (username) => {
  try {
    const response = await fetch(`${API_URL}${username}`);
    if (!response.ok) {
      throw new Error(
        "Nenhum perfil foi encontrado com esse nome de usuário. Tente novamente."
      );
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
    return null;
  }
};
