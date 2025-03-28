function fetchUser(username) {
  const url = `https://api.github.com/users/${username}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Nenhum perfil foi encontrado com esse nome de usuário. Tente novamente."
        );
      }
      return response.json();
    })
    .then((data) => {
      return {
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
      };
    })
    .catch((error) => {
      console.error(error);
      return { error: error.message };
    });
}

export { fetchUser };
