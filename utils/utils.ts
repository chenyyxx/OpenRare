export const fetchData = async (url: string) => {
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const fetchFlatUserSectionPost = async (url: string) => {
  const res = await fetch(url);
  const user_sections_posts = await res.json();
  const user_sections_posts_flat = [];
  for (let i = 0; i < user_sections_posts.sections.length; i++) {
    for (let j = 0; j < user_sections_posts.sections[i].posts.length; j++) {
      user_sections_posts_flat.push(user_sections_posts.sections[i].posts[j]);
    }
  }
  return user_sections_posts_flat;
};
