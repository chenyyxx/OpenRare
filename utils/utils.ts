export const fetchData = async (url: string) => {
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const fetchFlatUserSectionPost = async (url: string) => {
  const res = await fetch(url);
  const user_diseases_posts = await res.json();
  const user_diseases_posts_flat = [];
  
  // Handle the new diseases structure
  if (user_diseases_posts?.diseases) {
    for (let i = 0; i < user_diseases_posts.diseases.length; i++) {
      for (let j = 0; j < user_diseases_posts.diseases[i].posts.length; j++) {
        user_diseases_posts_flat.push(user_diseases_posts.diseases[i].posts[j]);
      }
    }
  }
  
  return user_diseases_posts_flat;
};
